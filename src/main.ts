import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 3008
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api')
    await app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
      
    })
  } catch (error) {
    
  }
}

start()
