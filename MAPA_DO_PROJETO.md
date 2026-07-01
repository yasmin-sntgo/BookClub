## Como o app funciona por cima

- `App.js` inicia o aplicativo.
- `AppNavigator.js` controla qual tela aparece.
- A pasta `screens` tem as telas completas.
- A pasta `components` tem partes menores que usamos em varias telas, partes reutilizaaveis.
- A pasta `data` tem os dados falsos que estamos usando por enquanto.
- A pasta `theme` guarda cores, fontes, espacamentos e estilos gerais.

Por enquanto o app ainda nao esta ligado a banco de dados nem API. Entao os livros, listas, resenhas e comentarios que aparecem estao vindo de um arquivo com dados falsos.

## Onde o app comeca

### `App.js`

Esse e o primeiro arquivo do app.

Ele nao tem as telas em si. Ele basicamente carrega as fontes, configura a barra de status e chama o navegador principal do app.

Se a gente pensar no app como uma casa, o `App.js` e a porta de entrada.

### `src/navigation/AppNavigator.js`

Esse e um dos arquivos mais importantes.

Ele decide qual tela aparece em cada momento.

Por exemplo:

- se o usuario esta no login;
- se ele entrou e foi para a home;
- se abriu um livro;
- se abriu uma lista;
- se abriu uma resenha;
- se apertou a seta de voltar.

Tambem e aqui que fica o historico de navegacao. Isso e importante porque, quando a pessoa faz um caminho como:

`Lista -> Livro -> Resenha`

a seta precisa voltar na ordem certa:

`Resenha -> Livro -> Lista`

Se alguma tela estiver voltando para o lugar errado, provavelmente vamos olhar primeiro o `AppNavigator.js`.

## Telas do app

As telas ficam dentro da pasta:

`src/screens`

Cada arquivo dessa pasta e uma tela grande do aplicativo.

### `LoginScreen.js`

E a tela de login.

Aqui fica a parte de entrar no app, com email, senha e botao de login.

### `RegisterScreen.js`

E a tela de cadastro.

Ela segue a mesma ideia visual do login, mas serve para criar uma conta.

### `HomeScreen.js`

E a tela inicial depois que o usuario entra.

Ela tem duas abas:

- `Livros`
- `Resenhas`

Se a gente quiser mudar o feed inicial, é aqui que vamos mexer.

### `ShelfScreen.js`

Essa e a tela da estante.

O nome `Shelf` significa `Estante`.

Ela mostra os livros organizados pelo usuario, como:

- favoritos;
- lendo agora;
- quero ler;
- lidos;
- abandonados.

### `SearchScreen.js`

Essa e a tela de busca.

O nome `Search` significa `Busca`.

Nela o usuario pode procurar:

- livros;
- usuarios;
- listas.

Essa tela tambem lembra a aba em que a pessoa estava. Por exemplo, se ela estava buscando em `Listas`, abriu uma lista e depois voltou, ela deve continuar na aba `Listas`, e nao voltar para `Livros`.

### `ListsScreen.js`

Essa e a tela geral de listas.

O nome `Lists` significa `Listas`.

Nessa tela aparecem:

- as listas do usuario;
- destaques do dia;
- categorias;
- listas salvas;
- explore listas.

Aqui é onde o usuario descobre listas criadas por outras pessoas.

### `ListDetailScreen.js`

Essa e a tela de uma lista especifica.

Por exemplo, quando o usuario clica em uma lista chamada `melhores livros nacionais`, ele abre essa tela.

Ela mostra:

- titulo da lista;
- criador;
- descricao;
- livros que fazem parte da lista;
- quantidade de livros;
- botao para salvar;
- botao de compartilhar;

Se a gente quiser mudar como uma lista aberta aparece, mexemos aqui.

### `BookDetailScreen.js`

Essa e a tela de um livro especifico.

O nome `BookDetail` significa `Detalhe do Livro`.

Ela mostra:

- capa;
- titulo;
- autor;
- genero;
- ano;
- paginas;
- editora;
- nota;
- sinopse;
- avaliacoes;
- resenhas;
- livros semelhantes.

Tambem tem botoes para:

- adicionar a estante;
- avaliar;
- escrever resenha;
- favoritar.

Se a gente quiser mudar a pagina de um livro, esse e o arquivo principal.

### `ReviewDetailScreen.js`

Essa e a tela de uma resenha aberta.

O nome `ReviewDetail` significa `Detalhe da Resenha`.

Ela mostra a resenha completa, o livro relacionado, curtidas, comentarios...

### `CreateReviewScreen.js`

Essa e a tela para criar uma resenha ou fazer uma avaliacao.

Ela tem dois modos:

- escrever uma resenha com texto;
- avaliar apenas com estrelas.

Se a gente for mexer no fluxo de publicar resenha ou dar nota, vamos mexer aqui.

## Componentes reutilizaveis

Os componentes ficam em:

`src/components`

Componentes sao partes menores da interface. Em vez de repetir o mesmo codigo em varias telas, criamos um componente e usamos ele onde precisar.

### `BottomNav.js`

E a barra de navegacao de baixo.

Ela tem:

- Inicio;
- Estante;
- botao `+`;
- Listas;
- Busca.

Se quisermos mudar a navegacao inferior, mexemos nesse arquivo.

### `CreateActionSheet.js`

E o menu que abre quando a pessoa aperta o botao `+`.

ele mostra opcoes como:

- escrever resenha;
- adicionar a estante;
- criar lista.

Algumas dessas funcoes ainda sao visuais, porque depois precisam ser ligadas ao banco de dados.

### `BookCover.js`

Esse componente mostra a capa do livro.

Se o livro tiver uma imagem de capa, ele mostra a imagem.
Se nao tiver imagem, ele cria uma capa com cores e letras.

Esse componente aparece em muitas telas, como home, busca, listas, estante e pagina do livro.

### `RatingStars.js`

Mostra as estrelas de avaliacao.

Usamos em livros, resenhas e na tela de criar avaliacao.

### `Icon.js`

Guarda os icones usados no app.

Exemplos:

- casa;
- busca;
- lista;
- estrela;
- coracao;
- comentario;
- voltar;
- tres pontinhos.

Se algum icone precisar mudar, ele provavelmente esta aqui.

### `FeedTabs.js`

Controla as abas da Home:

- Livros;
- Resenhas.

### `MascotTentacles.js`

E o componente dos tentaculos do mascote.

Ele aparece nas telas iniciais. Futuramente tem que melhorar a animacao dos tentaculos para cada um se mexer de forma independente.

### `AppButton.js` e `AppInput.js`

Sao componentes padrao de botao e campo de texto.

Eles ajudam a manter login e cadastro com o mesmo estilo.

### `AuthCard.js`

E o card usado nas telas de login e cadastro.

### `BrandLogo.js`

Mostra o logo do BookClub.

### `BackgroundGlow.js`

Ajuda no visual do fundo das telas iniciais.

### `EyeIcon.js`

Icone de olho usado para mostrar ou esconder a senha.

## Dados falsos do app

### `src/data/mockFeed.js`

Esse arquivo guarda os dados falsos do app.

Ele funciona como se fosse um banco de dados temporario.

Aqui ficam:

- livros;
- resenhas;
- comentarios;
- listas.

Por exemplo, se quisermos mudar o titulo de um livro, a capa, a nota ou uma lista, provavelmente vamos mexer nesse arquivo.

Um exemplo importante: antes, quando um livro nao tinha resenha, ele acabava mostrando uma resenha de outro livro. Isso foi corrigido na tela do livro, mas os dados continuam vindo daqui.

No futuro, quando o app tiver banco de dados e API, esse arquivo deve deixar de ser a fonte principal das informacoes.

## Estilo visual do app

O estilo base fica em:

`src/theme`

### `colors.js`

Guarda as cores principais.

Se quisermos mudar o tom do app, o fundo, a cor de destaque ou as bordas, esse e o primeiro arquivo para olhar.

### `typography.js`

Guarda as fontes e estilos de texto.

Aqui ficam as fontes principais usadas no app.

### `spacing.js`

Guarda os espacamentos padrao.

Ajuda a manter margens e distancias parecidas entre as telas.

### `shadows.js`

Guarda sombras usadas em cards e elementos visuais.

## Fonte do app

### `src/hooks/useAppFonts.js`

Esse arquivo carrega as fontes do app.

Se alguma fonte nao aparecer direito, pode ser por causa dele.

## Imagens e arquivos visuais

### `assets`

Essa pasta guarda imagens e arquivos visuais.

Aqui fica, por exemplo, a imagem dos tentaculos do mascote.

## Arquivos que a gente mais deve mexer

Se formos continuar o projeto, provavelmente vamos abrir mais estes arquivos:

### Para navegacao

`src/navigation/AppNavigator.js`

Usamos quando uma tela esta voltando para o lugar errado ou quando criamos uma tela nova.

### Para mudar livros, resenhas e listas falsas

`src/data/mockFeed.js`

Usamos para alterar os dados que aparecem no app enquanto nao temos banco de dados.

### Para mudar a Home

`src/screens/HomeScreen.js`

Usamos para mexer no feed de livros e resenhas.

### Para mudar a pagina do livro

`src/screens/BookDetailScreen.js`

Usamos para mexer em capa, sinopse, avaliacoes, resenhas e semelhantes.

### Para mudar listas

`src/screens/ListsScreen.js`

Usamos para mexer na pagina geral de listas.

`src/screens/ListDetailScreen.js`

Usamos para mexer na pagina de uma lista aberta.

### Para mudar a busca

`src/screens/SearchScreen.js`

Usamos para mexer na busca de livros, usuarios e listas.

### Para mudar a estante

`src/screens/ShelfScreen.js`

Usamos para mexer nas categorias de livros da estante.

### Para mudar a barra de baixo

`src/components/BottomNav.js`

Usamos para mexer na navegacao inferior.

### Para mudar cores e fontes

`src/theme/colors.js`

`src/theme/typography.js`

## Como pensar quando for mexer

Se quisermos mudar uma tela, primeiro procuramos em `src/screens`.

Exemplo:

Quer mudar a pagina do livro?

Abrimos:

`src/screens/BookDetailScreen.js`

Quer mudar a estante?

Abrimos:

`src/screens/ShelfScreen.js`

Quer mudar os dados que aparecem?

Abrimos:

`src/data/mockFeed.js`

Quer mudar uma parte que aparece em varias telas, como capa, estrelas ou barra de baixo?

Abrimos:

`src/components`

## O que ainda e provisorio

Algumas partes do app ainda sao apenas demonstrativas.

Por exemplo:

- salvar lista;
- denunciar;
- compartilhar;
- adicionar livro na estante;
- seguir usuarios;
- publicar resenha de verdade;
- conectar com banco de dados.

Essas partes ja tem interface, mas ainda precisam ser ligadas a um sistema real.

Por enquanto, o foco foi construir as telas, testar o design, ajustar a navegacao e deixar uma base boa para continuar o desenvolvimento.

## Resumo rapido para a dupla

Se voce se perder no projeto, pensa assim:

- `AppNavigator.js` decide para onde o app vai.
- `screens` sao as telas.
- `components` sao pecas usadas dentro das telas.
- `mockFeed.js` sao os dados falsos.
- `theme` define o visual geral.

Na duvida, comeca olhando a tela que voce quer mudar dentro de `src/screens`.
