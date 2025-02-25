# Dashboard de Análise de Dados

Este repositório contém um dashboard interativo para análise de dados, utilizando Docker Compose para facilitar a configuração e o deploy.

## Estrutura do Projeto

*   **backend/**: Contém a lógica do servidor, APIs e processamento de dados.
*   **frontend/**: Interface do usuário interativa para visualização e análise de dados.
*   **docker-compose.yml**: Arquivo de configuração do Docker Compose para orquestrar os containers.
*   **create-s3-bucket.sh**: Script para criação de um bucket S3.
*   **README.md**: Este arquivo com as instruções de execução.

## Pré-requisitos

*   Docker e Docker Compose instalados na máquina.

## Instruções de Execução

1.  **Permissões para o Script:**

    *   **Linux/macOS:** Abra um terminal na raiz do projeto e execute o comando:

        ```bash
        chmod +x create-s3-bucket.sh
        ```

    *   **Windows:** Abra o PowerShell como administrador, navegue até a pasta raiz do projeto e execute o comando:

        ```powershell
        .\create-s3-bucket.sh
        ```

2.  **Executando o Dashboard:**

    *   Na raiz do projeto, execute o comando:

        ```bash
        docker-compose up -d
        ```

        Este comando irá construir as imagens, criar os containers e iniciar o dashboard em segundo plano.

3.  **Acessando o Dashboard:**

    *   Abra o navegador e acesse o endereço http://localhost:80

## Configuração

*   **Variáveis de Ambiente (Não obrigatório localmente para iniciar a aplicação):** 
    *   As variáveis de ambiente para o backend e frontend podem ser configuradas nos respectivos arquivos `.env` dentro das pastas `backend` e `frontend`.

*   **Backend:**
    *   A pasta `backend` contém a lógica do servidor e as APIs.

*   **Frontend:**
    *   A pasta `frontend` contém a interface do usuário.

*   **Docker Compose:**
    *   O arquivo `docker-compose.yml` define os serviços (backend e frontend), suas dependências e as portas que serão expostas.

*   **Script create-s3-bucket.sh:**
    *   Este script é usado para criar um bucket S3 para armazenamento de dados

## Observações

*   Para parar o dashboard, execute o comando `docker-compose down` na raiz do projeto.