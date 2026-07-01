export const mockBooks = [
  {
    id: "sunrise",
    title: "Amanhecer na Colheita",
    author: "Suzanne Collins",
    genre: "Distopia",
    year: "2025",
    pages: "448",
    publisher: "Rocco",
    rating: 4.2,
    ratingsCount: "18 mil",
    readers: "18k",
    coverColors: ["#27143d", "#6f56a8"],
    mark: "AC",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781546171461-L.jpg"
  },
  {
    id: "dune",
    title: "Duna",
    author: "Frank Herbert",
    genre: "Ficcao cientifica",
    year: "1965",
    pages: "680",
    publisher: "Ace Books",
    rating: 4.8,
    ratingsCount: "32 mil",
    readers: "32k",
    synopsis:
      "Em um futuro distante, no planeta desertico Arrakis, Paul Atreides se ve no centro de uma disputa politica, religiosa e familiar pelo controle da especiaria mais valiosa do universo. Entre traicoes, profecias e uma ecologia implacavel, sua chegada a Duna transforma a historia de seu povo e revela forcas muito maiores do que uma disputa por poder.",
    coverColors: ["#5c3b1f", "#d7a660"],
    mark: "DU",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg"
  },
  {
    id: "housemaid",
    title: "A Empregada",
    author: "Freida McFadden",
    genre: "Suspense",
    year: "2022",
    pages: "336",
    publisher: "Arqueiro",
    rating: 3.9,
    ratingsCount: "11 mil",
    readers: "11k",
    coverColors: ["#142033", "#4778a8"],
    mark: "AE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781538742570-L.jpg"
  },
  {
    id: "it",
    title: "It: A Coisa",
    author: "Stephen King",
    genre: "Terror",
    year: "1986",
    pages: "1104",
    publisher: "Suma",
    rating: 4.6,
    ratingsCount: "27 mil",
    readers: "27k",
    coverColors: ["#24161a", "#b5424a"],
    mark: "IT",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg"
  },
  {
    id: "hobbit",
    title: "O Hobbit",
    author: "J. R. R. Tolkien",
    genre: "Fantasia",
    year: "1937",
    pages: "336",
    publisher: "HarperCollins",
    rating: 4.7,
    ratingsCount: "41 mil",
    readers: "41k",
    coverColors: ["#172617", "#78a35d"],
    mark: "OH",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"
  },
  {
    id: "foundation",
    title: "Fundacao",
    author: "Isaac Asimov",
    genre: "Ficcao cientifica",
    year: "1951",
    pages: "255",
    publisher: "Aleph",
    rating: 4.4,
    ratingsCount: "15 mil",
    readers: "15k",
    coverColors: ["#15233a", "#6aa6c8"],
    mark: "FU",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg"
  }
];

export const mockReviews = [
  {
    id: "review-1",
    user: "Yasmin",
    handle: "@yasmin_le",
    avatar: "Y",
    time: "2h",
    postedAt: "09:06 - 09/03/2026",
    views: "1.842",
    bookId: "sunrise",
    rating: 4,
    text:
      "A Suzanne Collins conseguiu me surpreender de novo. Achei que ja sabia tudo sobre esse universo, mas essa virada me deixou olhando para a parede por alguns minutos.",
    likes: 218,
    comments: 23,
    liked: true
  },
  {
    id: "review-2",
    user: "Marcos",
    handle: "@marcos.reads",
    avatar: "M",
    time: "5h",
    postedAt: "21:18 - 08/03/2026",
    views: "624",
    bookId: "dune",
    rating: 2,
    text:
      "Nao consegui me conectar com os personagens. A escrita e densa demais para mim, mas entendo completamente por que as pessoas amam tanto esse livro.",
    likes: 47,
    comments: 8,
    liked: false
  },
  {
    id: "review-3",
    user: "Carol",
    handle: "@carol_books",
    avatar: "C",
    time: "8h",
    postedAt: "18:44 - 08/03/2026",
    views: "2.109",
    bookId: "it",
    rating: 5,
    text:
      "Li em tres dias. Mil paginas e eu nao conseguia parar. O Stephen King faz voce se importar tanto com os personagens que quando pesa, pesa de verdade.",
    likes: 312,
    comments: 41,
    liked: false
  },
  {
    id: "review-4",
    user: "Lia Literatura",
    handle: "@lia.lit",
    avatar: "L",
    time: "2h",
    postedAt: "15:12 - 10/03/2026",
    views: "1.118",
    bookId: "sunrise",
    rating: 4,
    text:
      "Eu gosto quando uma historia parece abrir uma porta que eu achei que ja conhecia. Esse livro me deixou com aquela sensacao boa de terminar e ainda ficar pensando nos detalhes.",
    likes: 184,
    comments: 19,
    liked: false
  }
];

export const mockComments = [
  {
    id: "comment-1",
    reviewId: "review-1",
    user: "Marcos",
    handle: "@marcos.reads",
    avatar: "M",
    time: "12 min",
    text: "Eu senti exatamente isso. O livro parece que abre uma ferida antiga do universo inteiro.",
    likes: 12,
    liked: true
  },
  {
    id: "comment-2",
    reviewId: "review-1",
    user: "Carol Books",
    handle: "@carol_books",
    avatar: "C",
    time: "33 min",
    text: "Eu ainda estou criando coragem para ler, mas essa resenha me convenceu.",
    likes: 5,
    liked: false
  },
  {
    id: "comment-3",
    reviewId: "review-1",
    user: "Lia Literatura",
    handle: "@lia.lit",
    avatar: "L",
    time: "1 h",
    text: "A parte final me deixou destruida. Nao esperava gostar tanto.",
    likes: 3,
    liked: false
  },
  {
    id: "comment-4",
    reviewId: "review-2",
    user: "Yasmin",
    handle: "@yasmin_le",
    avatar: "Y",
    time: "20 min",
    text: "Eu entendo demais. Tem livro que a gente admira mais do que se conecta.",
    likes: 7,
    liked: true
  }
];

export const mockUsers = [
  {
    id: "yasmin",
    name: "Yasmin",
    handle: "@yasmin_le",
    avatar: "Y",
    bio: "resenhas sinceras de distopia, terror e drama",
    followers: "238",
    following: "94",
    reviewsCount: "12",
    ratingsCount: "38",
    listsCount: "6",
    isFollowing: false,
    shelfPrivate: false,
    shelfBookIds: ["sunrise", "dune", "hobbit", "foundation"],
    favoriteBookIds: ["dune", "hobbit"],
    listIds: ["before-die"],
    followerIds: ["lia", "carol", "marcos"],
    followingIds: ["lia", "carol"]
  },
  {
    id: "marcos",
    name: "Marcos Reads",
    handle: "@marcos.reads",
    avatar: "M",
    bio: "ficcao cientifica, fantasia e classicos",
    followers: "612",
    following: "180",
    reviewsCount: "18",
    ratingsCount: "52",
    listsCount: "4",
    isFollowing: false,
    shelfPrivate: true,
    shelfBookIds: [],
    favoriteBookIds: ["foundation"],
    listIds: ["sci-fi-start"],
    followerIds: ["yasmin", "carol"],
    followingIds: ["yasmin", "lia"]
  },
  {
    id: "carol",
    name: "Carol Books",
    handle: "@carol_books",
    avatar: "C",
    bio: "terror, suspense e livros enormes",
    followers: "1,2 mil",
    following: "206",
    reviewsCount: "34",
    ratingsCount: "91",
    listsCount: "7",
    isFollowing: true,
    shelfPrivate: false,
    shelfBookIds: ["it", "housemaid", "foundation"],
    favoriteBookIds: ["it"],
    listIds: ["night"],
    followerIds: ["yasmin", "lia"],
    followingIds: ["yasmin", "marcos", "lia"]
  },
  {
    id: "lia",
    name: "Lia Literatura",
    handle: "@lia.lit",
    avatar: "L",
    bio: "Leio fantasia, dramas estranhos e qualquer livro que prometa me deixar pensando nele por dias.",
    followers: "1,8 mil",
    following: "312",
    reviewsCount: "29",
    ratingsCount: "84",
    listsCount: "11",
    isFollowing: false,
    shelfPrivate: false,
    shelfBookIds: ["sunrise", "dune", "hobbit", "foundation"],
    favoriteBookIds: ["sunrise", "dune"],
    listIds: ["crying"],
    followerIds: ["yasmin", "carol", "marcos"],
    followingIds: ["yasmin", "carol"]
  }
];

export const mockNotifications = [
  {
    id: "notification-1",
    type: "follow",
    title: "Lia Literatura comecou a seguir voce",
    body: "Ela agora acompanha suas resenhas e listas.",
    time: "agora",
    read: false,
    userId: "lia"
  },
  {
    id: "notification-2",
    type: "reply",
    title: "Carol respondeu sua resenha",
    body: "Eu ainda estou criando coragem para ler, mas essa resenha me convenceu.",
    time: "33 min",
    read: false,
    userId: "carol",
    reviewId: "review-1"
  },
  {
    id: "notification-3",
    type: "like",
    title: "Marcos curtiu sua resenha",
    body: "Amanhecer na Colheita recebeu uma nova curtida.",
    time: "1 h",
    read: true,
    userId: "marcos",
    reviewId: "review-1"
  },
  {
    id: "notification-5",
    type: "comment",
    title: "Lia respondeu seu comentario",
    body: "A parte final me deixou destruida. Nao esperava gostar tanto.",
    time: "3 h",
    read: false,
    userId: "lia",
    reviewId: "review-1"
  },
  {
    id: "notification-4",
    type: "list",
    title: "Sua lista foi salva",
    body: "100 livros antes de morrer chegou a 14 mil salvos.",
    time: "ontem",
    read: true,
    listId: "before-die"
  }
];

export const mockLists = [
  {
    id: "before-die",
    title: "100 livros antes de morrer",
    creator: "Yasmin",
    handle: "@yasmin_le",
    description: "classicos, fantasias enormes e livros que parecem mudar alguma coisa dentro da gente.",
    booksCount: 100,
    saves: "14 mil",
    createdAt: "2026",
    updatedAt: "atualizada ha 2 dias",
    ordered: true,
    creatorNote:
      "Eu deixaria essa lista como um lugar para voltar aos poucos, sem tratar leitura como tarefa. A ordem aqui e parte da curadoria.",
    tag: "classicos",
    bookIds: ["dune", "hobbit", "foundation", "it"]
  },
  {
    id: "crying",
    title: "livros para chorar olhando pro teto",
    creator: "Lia Literatura",
    handle: "@lia.lit",
    description: "historias bonitas, doloridas e dramaticas do jeito certo.",
    booksCount: 28,
    saves: "8,7 mil",
    createdAt: "2026",
    updatedAt: "atualizada ontem",
    ordered: false,
    creatorNote: "Lista para quando voce quer sofrer um pouco, mas com qualidade.",
    tag: "chorar",
    bookIds: ["sunrise", "housemaid", "dune"]
  },
  {
    id: "sci-fi-start",
    title: "ficcao cientifica sem medo",
    creator: "Marcos Reads",
    handle: "@marcos.reads",
    description: "uma porta de entrada para quem quer comecar no genero sem se perder no caminho.",
    booksCount: 36,
    saves: "6,2 mil",
    createdAt: "2026",
    updatedAt: "atualizada ha 5 dias",
    ordered: true,
    creatorNote: "Comeca pelos mais acessiveis e vai ficando mais densa aos poucos.",
    tag: "ficcao cientifica",
    bookIds: ["dune", "foundation", "hobbit"]
  },
  {
    id: "night",
    title: "terror para ler de luz acesa",
    creator: "Carol Books",
    handle: "@carol_books",
    description: "suspense, horror e livros que ficam rondando a cabeca depois.",
    booksCount: 19,
    saves: "5,4 mil",
    createdAt: "2026",
    updatedAt: "atualizada ha 1 semana",
    ordered: false,
    creatorNote: "Sem ranking: aqui a ideia e escolher pelo clima do dia.",
    tag: "terror",
    bookIds: ["it", "housemaid", "foundation"]
  }
];
