# abntify

### Como funciona? 

Você já teve problemas para fazer a formatação do PDF para seus trabalhos acadêmicos?
Margens erradas, espaçamento diferente, sumário desalinhado ou textos com tamanho errado?

Pensando nisso, o projeto foi criado para automatizar a formatação de documentos acadêmicos nas normas da ABNT de forma simples e rápida.

## 🔧 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/mxteuss/FormatABNT.git
cd abntify

# 2. Instale as dependências
mvn clean install

# 3. Execute o backend
mvn spring-boot:run
```

## 📐 Especificações ABNT (NBR 14724:2011)

O sistema gera documentos acadêmicos seguindo a norma brasileira:

### Margens

- Superior: 3cm
- Esquerda: 3cm
- Direita: 3cm
- Inferior: 2cm

### Formatação

- Fonte: Para Título - Times New Roman, tamanho 14. Para texto - Times New Roman, tamanho 12.
- Alinhamento: Centralizado (elementos pré-textuais)
- Espaçamento: Simples
- Título: Negrito e Maíusculo

---

Se este projeto te ajudou, dê uma estrela :)
Sinta-se livre para contribuir!

