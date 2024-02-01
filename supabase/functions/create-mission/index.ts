import { serve } from 'http-server';
import { handler } from 'server/handler.ts';

serve(handler, { port: 8081 });
