-- Add tax_rate column to invoices table
ALTER TABLE public.invoices ADD COLUMN tax_rate numeric DEFAULT 18;