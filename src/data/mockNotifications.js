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
