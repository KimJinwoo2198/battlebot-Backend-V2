import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import DiscordRoute from './routes/discord.route';
import GuildRoute from './routes/guilds.route';
import InviteRoute from './routes/invite.route';
import PaymentsRoute from './routes/payments.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new GuildRoute(), new DiscordRoute(), new PaymentsRoute(), new InviteRoute()]);

app.listen();
