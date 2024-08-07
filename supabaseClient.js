import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whpyyzpfmysuwipdcypn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocHl5enBmbXlzdXdpcGRjeXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxOTQ2MjMsImV4cCI6MjAzNzc3MDYyM30.-FTLWhLDBhO_PPPNaAz99XUAWRRL3iTpX95d_qQ5l78';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


