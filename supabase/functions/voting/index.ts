import { serve } from 'http-server';
import { vote } from 'server/services/voting.ts';

serve(vote, { port: 8081 });
