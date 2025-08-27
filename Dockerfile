# Usa a imagem oficial do Node.js na versão 20
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração de dependências primeiro para otimizar o cache
COPY package.json package-lock.json ./

# Copia todo o restante do projeto
COPY . .

# Instala as dependências, usando a flag para resolver os conflitos de dependência
RUN npm install --legacy-peer-deps

# Expõe a porta que o seu servidor irá rodar, que é a 8080
EXPOSE 8080

# Comando para iniciar a aplicação, que irá construir o front-end e iniciar o back-end
CMD ["npm", "start"]