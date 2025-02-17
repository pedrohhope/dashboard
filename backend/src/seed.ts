import { NestFactory } from '@nestjs/core';
import { DatabaseSeedService } from './scripts/database-seed/database-seed.service';
import { DatabaseSeedModule } from './scripts/database-seed/database-seed.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(DatabaseSeedModule);
    const seedService = app.get(DatabaseSeedService);
    await seedService.seed();
    await app.close();
}

bootstrap()
    .then(() => {
        console.log('Seed executada com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Erro ao executar seed:', error);
        process.exit(1);
    });
