CREATE TABLE client_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_email text NOT NULL,
  client_email text NOT NULL,
  client_name text NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'open',
  budget text DEFAULT 'Negotiable',
  created_at timestamp with time zone DEFAULT now()
);
