# BookClub Login

Fluxo inicial de login, cadastro e feed em React Native usando Expo.

## Estrutura do projeto

```txt
src/
  components/   pecas reutilizaveis, como botao, campo, card, logo e tentaculos
  hooks/        carregamento das fontes do app
  navigation/   ponto onde as telas vao ser conectadas depois
  data/         dados falsos usados para desenhar o feed antes da API real
  screens/      telas completas, como LoginScreen, RegisterScreen e HomeScreen
  theme/        cores, fontes, espacamentos, raios e sombras
```

Para mudar a identidade visual sem quebrar a tela inteira:

- Cores: `src/theme/colors.js`
- Fontes e tamanhos: `src/theme/typography.js`
- Espacamentos e bordas: `src/theme/spacing.js`
- Tela de login: `src/screens/LoginScreen.js`
- Tela de cadastro: `src/screens/RegisterScreen.js`
- Tela Home/Feed: `src/screens/HomeScreen.js`
- Dados falsos do feed: `src/data/mockFeed.js`
- Tentaculos animados: `src/components/MascotTentacles.js`
- Imagem do mascote: `assets/mascot-tentacles.png`

## Como rodar no seu computador

1. Abra esta pasta no VS Code, vc ja fez kk

2. No VS Code, abra o terminal.

3. Instale as dependencias:

   npm install

4. Inicie o app limpando o cache antigo:

   npx expo start -c

5. Para abrir no navegador (nao recomendo, pq o design acaba ficando diferente):

   npx expo start -c --web

6. Para abrir no emulador Android depois de configurar o Android Studio:

   npx expo start -c --android

7. Se for usar celular, instale o app **Expo Go**. -- Melhor opção

8. Escaneie o QR Code que aparecer no terminal ou na pagina do Expo.

## Observacao

O app ainda nao faz login nem cadastro de verdade. Por enquanto ele monta o fluxo visual e deixa os campos funcionando, incluindo mostrar/ocultar senha.
