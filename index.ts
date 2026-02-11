
import app from './src/app';
import { PORT } from './src/utils/config';

app.listen(PORT, () => {
  console.info(`Server running at port ${PORT}`);
});
