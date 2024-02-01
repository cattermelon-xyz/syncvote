import { serve } from 'http-server';
import { vote } from 'server/voting.ts';

serve(vote, { port: 8081 });
