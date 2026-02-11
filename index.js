
import app from './src/app.ts'
import { PORT } from './src/utils/config.ts'

app.listen(PORT, () => {
  console.info(`Server running at port ${PORT}`)
})
