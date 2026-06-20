create or replace function increment_usage_counter(p_day date)
returns void as $$
  insert into public.usage_counters (day, ingestion_jobs_count)
  values (p_day, 1)
  on conflict (day) do update set ingestion_jobs_count = usage_counters.ingestion_jobs_count + 1;
$$ language sql;
