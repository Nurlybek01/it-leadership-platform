create table public.student_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  created_by uuid not null references auth.users(id) on delete cascade,
  member_ids uuid[] not null,
  created_at timestamptz not null default now(),
  constraint student_groups_member_limit check (
    cardinality(member_ids) between 1 and 5
    and member_ids[1] = created_by
  )
);

alter table public.student_groups enable row level security;

create policy "Students can view groups they participate in"
  on public.student_groups
  for select
  to authenticated
  using ((select auth.uid()) = any(member_ids));

create or replace function public.find_student_by_email(p_email text)
returns table (user_id uuid, name text, email text)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Необходима авторизация.';
  end if;
  if not exists (
    select 1
    from auth.users as caller
    where caller.id = auth.uid()
      and coalesce(caller.raw_user_meta_data ->> 'role', 'student') = 'student'
      and lower(caller.email) not like '%@teachers.tou.edu.kz'
  ) then
    raise exception 'Добавлять участников могут только студенты.';
  end if;

  return query
  select
    u.id,
    coalesce(
      nullif(u.raw_user_meta_data ->> 'name', ''),
      nullif(u.raw_user_meta_data ->> 'full_name', ''),
      split_part(u.email, '@', 1)
    ),
    lower(u.email)
  from auth.users as u
  where lower(u.email) = lower(btrim(p_email))
    and u.id <> auth.uid()
    and coalesce(u.raw_user_meta_data ->> 'role', 'student') = 'student'
    and lower(u.email) not like '%@teachers.tou.edu.kz'
    and u.email_confirmed_at is not null;
end;
$$;

create or replace function public.create_student_group(p_name text, p_member_emails text[])
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_name text := btrim(p_name);
  v_emails text[];
  v_member_ids uuid[];
  v_group_id uuid;
  v_found_count integer;
begin
  if v_owner_id is null then
    raise exception 'Необходима авторизация.';
  end if;
  if not exists (
    select 1
    from auth.users as caller
    where caller.id = v_owner_id
      and coalesce(caller.raw_user_meta_data ->> 'role', 'student') = 'student'
      and lower(caller.email) not like '%@teachers.tou.edu.kz'
  ) then
    raise exception 'Создавать группы могут только студенты.';
  end if;
  if v_name is null or char_length(v_name) not between 1 and 80 then
    raise exception 'Название группы должно содержать от 1 до 80 символов.';
  end if;
  if coalesce(cardinality(p_member_emails), 0) > 4 then
    raise exception 'В группе может быть не больше 5 человек, включая создателя.';
  end if;
  if exists (
    select 1
    from unnest(coalesce(p_member_emails, array[]::text[])) as input(email)
    where input.email is null or btrim(input.email) = ''
  ) then
    raise exception 'Email участников не может быть пустым.';
  end if;

  select array_agg(lower(btrim(input.email)))
  into v_emails
  from unnest(coalesce(p_member_emails, array[]::text[])) as input(email);

  if coalesce(cardinality(v_emails), 0) <> (
    select count(distinct input.email)
    from unnest(coalesce(v_emails, array[]::text[])) as input(email)
  ) then
    raise exception 'Email участников не должны повторяться.';
  end if;
  if lower((select u.email from auth.users as u where u.id = v_owner_id)) = any(coalesce(v_emails, array[]::text[])) then
    raise exception 'Нельзя добавить создателя повторно.';
  end if;

  select count(*)
  into v_found_count
  from auth.users as u
  where lower(u.email) = any(coalesce(v_emails, array[]::text[]))
    and coalesce(u.raw_user_meta_data ->> 'role', 'student') = 'student'
    and lower(u.email) not like '%@teachers.tou.edu.kz'
    and u.email_confirmed_at is not null;

  if v_found_count <> coalesce(cardinality(v_emails), 0) then
    raise exception 'Один или несколько адресов не принадлежат аккаунтам студентов.';
  end if;

  select array_agg(u.id order by lower(u.email))
  into v_member_ids
  from auth.users as u
  where lower(u.email) = any(coalesce(v_emails, array[]::text[]));

  insert into public.student_groups (name, created_by, member_ids)
  values (v_name, v_owner_id, array[v_owner_id] || coalesce(v_member_ids, array[]::uuid[]))
  returning id into v_group_id;

  return v_group_id;
end;
$$;

create or replace function public.get_my_student_groups()
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', g.id,
        'name', g.name,
        'createdAt', g.created_at,
        'members', coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'id', member_user.id,
                'name', coalesce(
                  nullif(member_user.raw_user_meta_data ->> 'name', ''),
                  nullif(member_user.raw_user_meta_data ->> 'full_name', ''),
                  split_part(member_user.email, '@', 1)
                ),
                'email', lower(member_user.email)
              )
              order by group_member.position
            )
            from unnest(g.member_ids) with ordinality as group_member(user_id, position)
            join auth.users as member_user on member_user.id = group_member.user_id
          ),
          '[]'::jsonb
        )
      )
      order by g.created_at desc
    ),
    '[]'::jsonb
  )
  from public.student_groups as g
  where auth.uid() = any(g.member_ids);
$$;

revoke all on function public.find_student_by_email(text) from public;
revoke all on function public.create_student_group(text, text[]) from public;
revoke all on function public.get_my_student_groups() from public;
grant execute on function public.find_student_by_email(text) to authenticated;
grant execute on function public.create_student_group(text, text[]) to authenticated;
grant execute on function public.get_my_student_groups() to authenticated;

notify pgrst, 'reload schema';
