# Use a imagem oficial do Node.js na versão 20
FROM node:20

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos de configuração do projeto
COPY package.json package-lock.json ./

# Instale as dependências usando npm
RUN npm install --force

# Copie o restante dos arquivos do projeto
COPY . .

# Expõe a porta que sua aplicação usa (3000 é a porta padrão)
EXPOSE 3000

# Comando para iniciar o servidor, usando o script 'start' do seu package.json
CMD [ "npm", "start" ]