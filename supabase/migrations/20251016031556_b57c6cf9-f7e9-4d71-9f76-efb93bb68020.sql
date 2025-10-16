-- Create warehouse_stock table
CREATE TABLE IF NOT EXISTS public.warehouse_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  month DATE NOT NULL,
  product_name TEXT NOT NULL,
  opening NUMERIC NOT NULL DEFAULT 0,
  production NUMERIC NOT NULL DEFAULT 0,
  sales NUMERIC NOT NULL DEFAULT 0,
  closing NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributor_stock table
CREATE TABLE IF NOT EXISTS public.distributor_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  month DATE NOT NULL,
  product_name TEXT NOT NULL,
  opening NUMERIC NOT NULL DEFAULT 0,
  production NUMERIC NOT NULL DEFAULT 0,
  sales NUMERIC NOT NULL DEFAULT 0,
  closing NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create raw_materials_stock table
CREATE TABLE IF NOT EXISTS public.raw_materials_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  month DATE NOT NULL,
  chemical_name TEXT NOT NULL,
  opening NUMERIC NOT NULL DEFAULT 0,
  purchased NUMERIC NOT NULL DEFAULT 0,
  used NUMERIC NOT NULL DEFAULT 0,
  closing NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indent_sheet_entries table
CREATE TABLE IF NOT EXISTS public.indent_sheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  month DATE NOT NULL,
  formulation_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.warehouse_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indent_sheet_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for warehouse_stock
CREATE POLICY "Allow all operations on warehouse_stock"
ON public.warehouse_stock
FOR ALL
USING (true)
WITH CHECK (true);

-- Create RLS policies for distributor_stock
CREATE POLICY "Allow all operations on distributor_stock"
ON public.distributor_stock
FOR ALL
USING (true)
WITH CHECK (true);

-- Create RLS policies for raw_materials_stock
CREATE POLICY "Allow all operations on raw_materials_stock"
ON public.raw_materials_stock
FOR ALL
USING (true)
WITH CHECK (true);

-- Create RLS policies for indent_sheet_entries
CREATE POLICY "Allow all operations on indent_sheet_entries"
ON public.indent_sheet_entries
FOR ALL
USING (true)
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_warehouse_stock_updated_at
BEFORE UPDATE ON public.warehouse_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_distributor_stock_updated_at
BEFORE UPDATE ON public.distributor_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_raw_materials_stock_updated_at
BEFORE UPDATE ON public.raw_materials_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_indent_sheet_entries_updated_at
BEFORE UPDATE ON public.indent_sheet_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();