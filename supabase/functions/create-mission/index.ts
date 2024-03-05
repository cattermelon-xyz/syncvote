import { serve } from 'http-server';
import { handler } from 'server/services/handler.ts';

serve(handler, { port: 8081 });
