import { supabase } from './supabase';

export interface VinDetails {
  make?: string;
  model?: string;
  style?: string;
  year?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
}

export const lookupVinDetails = async (vin: string): Promise<VinDetails | null> => {
  try {
    // Extract make and model codes from VIN
    const makeCode = vin.substring(0, 3);
    const modelCode = vin.substring(3, 6);
    const styleCode = vin.substring(6, 8);
    const year = getModelYear(vin[9]);

    // Query the database for details
    const { data: makeData } = await supabase
      .from('vinmake')
      .select('id, make_name')
      .eq('make_code', makeCode)
      .single();

    if (!makeData) return null;

    const { data: modelData } = await supabase
      .from('vinmodel')
      .select('id, model_name')
      .eq('make_id', makeData.id)
      .eq('model_code', modelCode)
      .single();

    if (!modelData) return null;

    const { data: styleData } = await supabase
      .from('vinstyle')
      .select('style_name, body_type, engine, transmission')
      .eq('model_id', modelData.id)
      .eq('style_code', styleCode)
      .single();

    return {
      make: makeData.make_name,
      model: modelData.model_name,
      style: styleData?.style_name,
      year,
      bodyType: styleData?.body_type,
      engine: styleData?.engine,
      transmission: styleData?.transmission
    };
  } catch (error) {
    console.error('VIN lookup error:', error);
    return null;
  }
};

const getModelYear = (yearChar: string): string => {
  const yearCodes: Record<string, number> = {
    'A': 1980, 'B': 1981, 'C': 1982, 'D': 1983, 'E': 1984,
    'F': 1985, 'G': 1986, 'H': 1987, 'J': 1988, 'K': 1989,
    'L': 1990, 'M': 1991, 'N': 1992, 'P': 1993, 'R': 1994,
    'S': 1995, 'T': 1996, 'V': 1997, 'W': 1998, 'X': 1999,
    'Y': 2000, '1': 2001, '2': 2002, '3': 2003, '4': 2004,
    '5': 2005, '6': 2006, '7': 2007, '8': 2008, '9': 2009,
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024
  };
  
  return yearCodes[yearChar]?.toString() || '';
};