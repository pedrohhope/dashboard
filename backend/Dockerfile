# Stage 1: Construção da aplicação
FROM node:16-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (incluindo as de desenvolvimento)
RUN npm install

# Copia o restante do código para o container
COPY . .

# Compila a aplicação NestJS (gerando a pasta "dist")
RUN npm run build


# Stage 2: Imagem final para produção
FROM node:16-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para produção
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --only=production

# Copia os arquivos compilados da etapa anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta que o NestJS utiliza
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
