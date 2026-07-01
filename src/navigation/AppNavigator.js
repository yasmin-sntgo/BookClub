import { useState } from "react";

import { CreateActionSheet } from "../components/CreateActionSheet";
import { AddToShelfScreen } from "../screens/AddToShelfScreen";
import { ConnectionsScreen } from "../screens/ConnectionsScreen";
import { BookDetailScreen } from "../screens/BookDetailScreen";
import { BookRatingsScreen } from "../screens/BookRatingsScreen";
import { BookReviewsScreen } from "../screens/BookReviewsScreen";
import { CreateListScreen } from "../screens/CreateListScreen";
import { CreateReviewScreen } from "../screens/CreateReviewScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { InteractionsScreen } from "../screens/InteractionsScreen";
import { ListDetailScreen } from "../screens/ListDetailScreen";
import { ListsScreen } from "../screens/ListsScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ReviewDetailScreen } from "../screens/ReviewDetailScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { ShelfScreen } from "../screens/ShelfScreen";
import { mockComments, mockLists, mockNotifications, mockReviews } from "../data/mockFeed";

const initialShelfEntries = [
  { bookId: "dune", status: "reading", favorite: true },
  { bookId: "it", status: "reading", favorite: false },
  { bookId: "sunrise", status: "want", favorite: false },
  { bookId: "hobbit", status: "read", favorite: true },
  { bookId: "housemaid", status: "abandoned", favorite: false }
];

export function AppNavigator() {
  const [screen, setScreen] = useState("login");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("dune");
  const [selectedCreateBookId, setSelectedCreateBookId] = useState(null);
  const [selectedListId, setSelectedListId] = useState("before-die");
  const [selectedReviewId, setSelectedReviewId] = useState("review-1");
  const [selectedShelfBookId, setSelectedShelfBookId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("lia");
  const [selectedConnectionsUserId, setSelectedConnectionsUserId] = useState("yasmin");
  const [profileOverride, setProfileOverride] = useState(null);
  const [homeInitialTab, setHomeInitialTab] = useState("books");
  const [profileInitialTab, setProfileInitialTab] = useState("Resenhas");
  const [searchInitialTab, setSearchInitialTab] = useState("Livros");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionsInitialTab, setConnectionsInitialTab] = useState("Seguidores");
  const [createOrigin, setCreateOrigin] = useState("home");
  const [bookOrigin, setBookOrigin] = useState("home");
  const [listOrigin, setListOrigin] = useState("lists");
  const [reviewOrigin, setReviewOrigin] = useState("reviews");
  const [savedListIds, setSavedListIds] = useState(["crying", "sci-fi-start"]);
  const [savedReviewIds, setSavedReviewIds] = useState([]);
  const [followedUserIds, setFollowedUserIds] = useState(["carol"]);
  const [likedReviewIds, setLikedReviewIds] = useState(
    mockReviews.filter((review) => review.liked).map((review) => review.id)
  );
  const [likedCommentIds, setLikedCommentIds] = useState(
    mockComments.filter((comment) => comment.liked).map((comment) => comment.id)
  );
  const [shelfEntries, setShelfEntries] = useState(initialShelfEntries);
  const [createdLists, setCreatedLists] = useState([]);
  const [createdReviews, setCreatedReviews] = useState([]);
  const [createdRatings, setCreatedRatings] = useState([]);
  const [createdComments, setCreatedComments] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [history, setHistory] = useState([]);
  const allLists = [...createdLists, ...mockLists];
  const allReviews = [...createdReviews, ...mockReviews];
  const allComments = [...createdComments, ...mockComments];
  const unreadNotificationsCount = mockNotifications.filter(
    (notification) => !notification.read && !readNotificationIds.includes(notification.id)
  ).length;

  function currentRoute(overrides = {}) {
    return {
      screen,
      selectedBookId,
      selectedCreateBookId,
      selectedListId,
      selectedReviewId,
      selectedShelfBookId,
      selectedUserId,
      selectedConnectionsUserId,
      homeInitialTab,
      profileInitialTab,
      searchInitialTab,
      searchQuery,
      connectionsInitialTab,
      createOrigin,
      bookOrigin,
      listOrigin,
      reviewOrigin,
      ...overrides
    };
  }

  function restoreRoute(route) {
    setSelectedBookId(route.selectedBookId);
    setSelectedCreateBookId(route.selectedCreateBookId);
    setSelectedListId(route.selectedListId);
    setSelectedReviewId(route.selectedReviewId);
    setSelectedShelfBookId(route.selectedShelfBookId ?? null);
    setSelectedUserId(route.selectedUserId ?? "lia");
    setSelectedConnectionsUserId(route.selectedConnectionsUserId ?? "yasmin");
    setHomeInitialTab(route.homeInitialTab ?? "books");
    setProfileInitialTab(route.profileInitialTab ?? "Resenhas");
    setSearchInitialTab(route.searchInitialTab ?? "Livros");
    setSearchQuery(route.searchQuery ?? "");
    setConnectionsInitialTab(route.connectionsInitialTab ?? "Seguidores");
    setCreateOrigin(route.createOrigin ?? "home");
    setBookOrigin(route.bookOrigin ?? "home");
    setListOrigin(route.listOrigin ?? "lists");
    setReviewOrigin(route.reviewOrigin ?? "reviews");
    setScreen(route.screen);
  }

  function pushRoute(route = currentRoute()) {
    setHistory((current) => [...current, route]);
  }

  function goBack(fallback = () => goHome(homeInitialTab)) {
    const previousRoute = history[history.length - 1];

    if (!previousRoute) {
      fallback();
      return;
    }

    setHistory((current) => current.slice(0, -1));
    restoreRoute(previousRoute);
  }

  function navigateRoot(nextScreen) {
    setHistory([]);
    setCreateOpen(false);
    setScreen(nextScreen);
  }

  function openBook(bookId, origin = screen, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedBookId(bookId);
    setBookOrigin(origin === "book" ? bookOrigin : origin);
    setScreen("book");
  }

  function openBookRatings(bookId, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedBookId(bookId);
    setScreen("bookRatings");
  }

  function openBookReviews(bookId, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedBookId(bookId);
    setScreen("bookReviews");
  }

  function openReview(reviewId, origin = "reviews", previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedReviewId(reviewId);
    setReviewOrigin(origin);
    setHomeInitialTab(origin === "reviews" ? "reviews" : "books");
    setScreen("review");
  }

  function openList(listId, origin = screen, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedListId(listId);
    setListOrigin(origin === "listDetail" ? listOrigin : origin);
    setScreen("listDetail");
  }

  function openUser(userId, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedUserId(userId);
    setScreen("profile");
  }

  function openConnections(userId, initialTab = "Seguidores", previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSelectedConnectionsUserId(userId);
    setConnectionsInitialTab(initialTab);
    setScreen("connections");
  }

  function openNotifications(previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setScreen("notifications");
  }

  function openEditProfile(previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setScreen("editProfile");
  }

  function openInteractions(previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setScreen("interactions");
  }

  function openAddToShelf(bookId = null, previousRoute = currentRoute()) {
    setSelectedShelfBookId(bookId);
    setCreateOpen(false);
    pushRoute(previousRoute);
    setScreen("addToShelf");
  }

  function openCreateList(previousRoute = currentRoute()) {
    setCreateOpen(false);
    pushRoute(previousRoute);
    setScreen("createList");
  }

  function goHome(tab = "books") {
    setHistory([]);
    setHomeInitialTab(tab);
    setScreen("home");
  }

  function goToOrigin(origin) {
    if (origin === "home") {
      goHome(homeInitialTab);
      return;
    }
    setScreen(origin);
  }

  function goToReviewOrigin(origin) {
    if (origin === "reviews") {
      goHome("reviews");
      return;
    }

    if (["book", "bookReviews", "profile", "interactions", "notifications"].includes(origin)) {
      setScreen(origin);
      return;
    }

    goHome(homeInitialTab);
  }

  function goToBook() {
    setScreen("book");
  }

  function openCreateReview(bookId = null, mode = "review", origin = screen, previousRoute = currentRoute()) {
    setSelectedCreateBookId(bookId);
    setCreateOrigin(origin);
    setCreateOpen(false);
    pushRoute(previousRoute);
    setScreen(mode === "rating" ? "createRating" : "createReview");
  }

  function handleCreateAction(actionId) {
    const previousRoute = currentRoute();
    const currentBookId = screen === "book" ? selectedBookId : null;

    setCreateOpen(false);
    if (actionId === "review") {
      openCreateReview(currentBookId, "review", screen, previousRoute);
    }
    if (actionId === "rating") {
      openCreateReview(currentBookId, "rating", screen, previousRoute);
    }
    if (actionId === "shelf") {
      openAddToShelf(currentBookId, previousRoute);
    }
    if (actionId === "list") {
      openCreateList(previousRoute);
    }
  }

  function markNotificationRead(notificationId) {
    setReadNotificationIds((current) =>
      current.includes(notificationId) ? current : [...current, notificationId]
    );
  }

  function markAllNotificationsRead() {
    setReadNotificationIds(mockNotifications.map((notification) => notification.id));
  }

  function toggleListSave(listId) {
    setSavedListIds((current) =>
      current.includes(listId)
        ? current.filter((savedListId) => savedListId !== listId)
        : [...current, listId]
    );
  }

  function toggleReviewSave(reviewId) {
    setSavedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((savedReviewId) => savedReviewId !== reviewId)
        : [...current, reviewId]
    );
  }

  function toggleFollow(userId) {
    if (userId === "yasmin") {
      return;
    }

    setFollowedUserIds((current) =>
      current.includes(userId)
        ? current.filter((followedUserId) => followedUserId !== userId)
        : [...current, userId]
    );
  }

  function toggleReviewLike(reviewId) {
    setLikedReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((likedReviewId) => likedReviewId !== reviewId)
        : [...current, reviewId]
    );
  }

  function toggleCommentLike(commentId) {
    setLikedCommentIds((current) =>
      current.includes(commentId)
        ? current.filter((likedCommentId) => likedCommentId !== commentId)
        : [...current, commentId]
    );
  }

  function saveShelfEntry(nextEntry) {
    setShelfEntries((current) => {
      const alreadyExists = current.some((entry) => entry.bookId === nextEntry.bookId);

      if (!alreadyExists) {
        return [...current, nextEntry];
      }

      return current.map((entry) =>
        entry.bookId === nextEntry.bookId ? { ...entry, ...nextEntry } : entry
      );
    });
    setSelectedShelfBookId(null);
    navigateRoot("library");
  }

  function setBookShelfStatus(bookId, statusLabel) {
    const statusByLabel = {
      Lendo: "reading",
      "Quero ler": "want",
      Lido: "read",
      Abandonado: "abandoned"
    };
    const nextStatus = statusByLabel[statusLabel] ?? "want";

    setShelfEntries((current) => {
      const existingEntry = current.find((entry) => entry.bookId === bookId);

      if (!existingEntry) {
        return [...current, { bookId, status: nextStatus, favorite: false }];
      }

      return current.map((entry) =>
        entry.bookId === bookId ? { ...entry, status: nextStatus } : entry
      );
    });
  }

  function toggleBookFavorite(bookId) {
    setShelfEntries((current) => {
      const existingEntry = current.find((entry) => entry.bookId === bookId);

      if (!existingEntry) {
        return [...current, { bookId, status: "want", favorite: true }];
      }

      return current.map((entry) =>
        entry.bookId === bookId ? { ...entry, favorite: !entry.favorite } : entry
      );
    });
  }

  function openSearchByGenre(genre, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSearchInitialTab("Livros");
    setSearchQuery(genre);
    setScreen("search");
  }

  function saveCreatedList(listDraft) {
    const nextList = {
      id: `user-list-${createdLists.length + 1}`,
      local: true,
      title: listDraft.title,
      creator: "Yasmin",
      handle: "@yasmin_le",
      description: listDraft.description || "lista criada por voce no BookClub.",
      booksCount: listDraft.bookIds.length,
      saves: "0",
      createdAt: "2026",
      updatedAt: "criada agora",
      ordered: listDraft.ordered,
      private: listDraft.private,
      creatorNote: listDraft.creatorNote || "Sem nota do criador por enquanto.",
      tag: listDraft.tag,
      bookIds: listDraft.bookIds
    };

    setCreatedLists((current) => [nextList, ...current]);
    setSelectedListId(nextList.id);
    setListOrigin("lists");
    setHistory([]);
    setScreen("listDetail");
  }

  function saveCreatedReview(reviewDraft) {
    if (reviewDraft.mode === "rating") {
      const ratingHandle = profileOverride?.handle || "@yasmin_le";
      const nextRating = {
        local: true,
        user: "Yasmin",
        handle: ratingHandle,
        avatar: profileOverride?.avatar || "Y",
        time: "agora",
        bookId: reviewDraft.bookId,
        rating: reviewDraft.rating
      };

      setCreatedRatings((current) => {
        const existingRating = current.find(
          (ratingItem) => ratingItem.bookId === reviewDraft.bookId && ratingItem.handle === ratingHandle
        );

        if (existingRating) {
          return current.map((ratingItem) =>
            ratingItem.id === existingRating.id ? { ...ratingItem, ...nextRating } : ratingItem
          );
        }

        return [{ ...nextRating, id: `user-rating-${current.length + 1}` }, ...current];
      });
      setSelectedBookId(reviewDraft.bookId);
      setHistory((current) => current.slice(0, -1));
      setScreen(createOrigin === "bookRatings" ? "bookRatings" : "book");
      return;
    }

    const nextReview = {
      id: `user-review-${createdReviews.length + 1}`,
      local: true,
      user: profileOverride?.name || "Yasmin",
      handle: profileOverride?.handle || "@yasmin_le",
      avatar: profileOverride?.avatar || "Y",
      time: "agora",
      postedAt: "agora - 14/06/2026",
      views: "0",
      bookId: reviewDraft.bookId,
      rating: reviewDraft.rating,
      text: reviewDraft.hasSpoiler ? `[spoiler] ${reviewDraft.text}` : reviewDraft.text,
      likes: 0,
      comments: 0,
      liked: false,
      hasSpoiler: reviewDraft.hasSpoiler
    };

    setCreatedReviews((current) => [nextReview, ...current]);
    setSelectedReviewId(nextReview.id);
    setHomeInitialTab("reviews");
    setScreen("review");
  }

  function saveCreatedComment(commentDraft) {
    const nextComment = {
      id: `user-comment-${createdComments.length + 1}`,
      reviewId: commentDraft.reviewId,
      user: profileOverride?.name || "Yasmin",
      handle: profileOverride?.handle || "@yasmin_le",
      avatar: profileOverride?.avatar || "Y",
      time: "agora",
      text: commentDraft.replyingTo ? `@${commentDraft.replyingTo} ${commentDraft.text}` : commentDraft.text,
      likes: 0,
      liked: false
    };

    setCreatedComments((current) => [nextComment, ...current]);
  }

  function withCreateSheet(content) {
    return (
      <>
        {content}
        <CreateActionSheet visible={createOpen} onClose={handleCreateAction} />
      </>
    );
  }

  if (screen === "register") {
    return (
      <RegisterScreen
        onCreateAccount={() => goHome("books")}
        onLogin={() => navigateRoot("login")}
      />
    );
  }

  if (screen === "home") {
    return withCreateSheet(
      <HomeScreen
        reviews={allReviews}
        comments={allComments}
        followedUserIds={followedUserIds}
        initialTab={homeInitialTab}
        likedReviewIds={likedReviewIds}
        savedReviewIds={savedReviewIds}
        onBookOpen={(bookId, tab = "books") => {
          setHomeInitialTab(tab);
          openBook(bookId, "home", currentRoute({ screen: "home", homeInitialTab: tab }));
        }}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onNotificationsOpen={() => openNotifications(currentRoute({ screen: "home", homeInitialTab }))}
        onReviewOpen={(reviewId, tab = "reviews") => {
          setHomeInitialTab(tab);
          openReview(reviewId, tab, currentRoute({ screen: "home", homeInitialTab: tab }));
        }}
        onTabChange={setHomeInitialTab}
        onToggleReviewLike={toggleReviewLike}
        onToggleReviewSave={toggleReviewSave}
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "home", homeInitialTab }))}
        unreadNotificationsCount={unreadNotificationsCount}
      />
    );
  }

  if (screen === "library") {
    return withCreateSheet(
      <ShelfScreen
        shelfEntries={shelfEntries}
        onAddToShelf={() => openAddToShelf(null, currentRoute({ screen: "library" }))}
        onBookOpen={(bookId) => openBook(bookId, "library", currentRoute({ screen: "library" }))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
      />
    );
  }

  if (screen === "addToShelf") {
    return withCreateSheet(
      <AddToShelfScreen
        initialBookId={selectedShelfBookId}
        shelfEntries={shelfEntries}
        onBack={() => goBack(() => navigateRoot("library"))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onSave={saveShelfEntry}
      />
    );
  }

  if (screen === "search") {
    return withCreateSheet(
      <SearchScreen
        initialQuery={searchQuery}
        initialTab={searchInitialTab}
        lists={allLists}
        followedUserIds={followedUserIds}
        onBookOpen={(bookId) => openBook(bookId, "search", currentRoute({ screen: "search" }))}
        onCreate={() => setCreateOpen(true)}
        onListOpen={(listId) => openList(listId, "search", currentRoute({ screen: "search" }))}
        onNavigate={navigateRoot}
        onQueryChange={setSearchQuery}
        onToggleFollow={toggleFollow}
        onToggleListSave={toggleListSave}
        onTabChange={setSearchInitialTab}
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "search" }))}
        savedListIds={savedListIds}
      />
    );
  }

  if (screen === "lists") {
    return withCreateSheet(
      <ListsScreen
        lists={allLists}
        savedListIds={savedListIds}
        onBookOpen={(bookId) => openBook(bookId, "lists", currentRoute({ screen: "lists" }))}
        onCreate={() => setCreateOpen(true)}
        onListOpen={(listId) => openList(listId, "lists", currentRoute({ screen: "lists" }))}
        onNavigate={navigateRoot}
      />
    );
  }

  if (screen === "createList") {
    return withCreateSheet(
      <CreateListScreen
        onBack={() => goBack(() => navigateRoot("lists"))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onSave={saveCreatedList}
      />
    );
  }

  if (screen === "listDetail") {
    return withCreateSheet(
      <ListDetailScreen
        key={selectedListId}
        lists={allLists}
        listId={selectedListId}
        saved={savedListIds.includes(selectedListId)}
        onBack={() => goBack(() => goToOrigin(listOrigin))}
        onBookOpen={(bookId) =>
          openBook(bookId, "listDetail", currentRoute({ screen: "listDetail", selectedListId }))
        }
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onToggleSave={toggleListSave}
      />
    );
  }

  if (screen === "notifications") {
    return withCreateSheet(
      <NotificationsScreen
        notifications={mockNotifications}
        readNotificationIds={readNotificationIds}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onBookOpen={(bookId) => openBook(bookId, "notifications", currentRoute({ screen: "notifications" }))}
        onCreate={() => setCreateOpen(true)}
        onListOpen={(listId) => openList(listId, "notifications", currentRoute({ screen: "notifications" }))}
        onMarkAllRead={markAllNotificationsRead}
        onNavigate={navigateRoot}
        onNotificationRead={markNotificationRead}
        onReviewOpen={(reviewId, origin = "reviews") =>
          openReview(reviewId, origin, currentRoute({ screen: "notifications" }))
        }
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "notifications" }))}
      />
    );
  }

  if (screen === "book") {
    return withCreateSheet(
      <BookDetailScreen
        key={selectedBookId}
        bookId={selectedBookId}
        ratings={createdRatings}
        reviews={allReviews}
        comments={allComments}
        shelfEntry={shelfEntries.find((entry) => entry.bookId === selectedBookId)}
        onBack={() => goBack(() => goToOrigin(bookOrigin))}
        onAddToShelf={(bookId) =>
          openAddToShelf(bookId, currentRoute({ screen: "book", selectedBookId }))
        }
        onBookOpen={(bookId) =>
          openBook(bookId, bookOrigin, currentRoute({ screen: "book", selectedBookId }))
        }
        onCreateReview={(bookId) =>
          openCreateReview(bookId, "review", "book", currentRoute({ screen: "book", selectedBookId }))
        }
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onRateBook={(bookId) =>
          openCreateReview(bookId, "rating", "book", currentRoute({ screen: "book", selectedBookId }))
        }
        onRatingsOpen={(bookId) =>
          openBookRatings(bookId, currentRoute({ screen: "book", selectedBookId }))
        }
        onReviewOpen={(reviewId, origin = "book") =>
          openReview(reviewId, origin, currentRoute({ screen: "book", selectedBookId }))
        }
        onReviewsOpen={(bookId) =>
          openBookReviews(bookId, currentRoute({ screen: "book", selectedBookId }))
        }
        onSearchGenre={(genre) =>
          openSearchByGenre(genre, currentRoute({ screen: "book", selectedBookId }))
        }
        onShelfStatusChange={setBookShelfStatus}
        onToggleFavorite={toggleBookFavorite}
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "book", selectedBookId }))}
      />
    );
  }

  if (screen === "bookRatings") {
    return withCreateSheet(
      <BookRatingsScreen
        key={selectedBookId}
        bookId={selectedBookId}
        ratings={createdRatings}
        reviews={allReviews}
        comments={allComments}
        onBack={() => goBack(goToBook)}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onRateBook={(bookId) =>
          openCreateReview(bookId, "rating", "bookRatings", currentRoute({ screen: "bookRatings", selectedBookId }))
        }
        onReviewOpen={(reviewId) =>
          openReview(reviewId, "book", currentRoute({ screen: "bookRatings", selectedBookId }))
        }
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "bookRatings", selectedBookId }))}
      />
    );
  }

  if (screen === "bookReviews") {
    return withCreateSheet(
      <BookReviewsScreen
        key={selectedBookId}
        bookId={selectedBookId}
        reviews={allReviews}
        onBack={() => goBack(goToBook)}
        onCreate={() => setCreateOpen(true)}
        onCreateReview={(bookId) =>
          openCreateReview(bookId, "review", "bookReviews", currentRoute({ screen: "bookReviews", selectedBookId }))
        }
        onNavigate={navigateRoot}
        onReviewOpen={(reviewId) =>
          openReview(reviewId, "bookReviews", currentRoute({ screen: "bookReviews", selectedBookId }))
        }
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "bookReviews", selectedBookId }))}
      />
    );
  }

  if (screen === "createReview" || screen === "createRating") {
    return withCreateSheet(
      <CreateReviewScreen
        bookId={selectedCreateBookId}
        mode={screen === "createRating" ? "rating" : "review"}
        onBack={() => goBack(() => goToOrigin(createOrigin))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onSave={saveCreatedReview}
      />
    );
  }

  if (screen === "review") {
    return withCreateSheet(
      <ReviewDetailScreen
        key={selectedReviewId}
        reviewId={selectedReviewId}
        likedCommentIds={likedCommentIds}
        likedReviewIds={likedReviewIds}
        saved={savedReviewIds.includes(selectedReviewId)}
        comments={allComments}
        reviews={allReviews}
        onBack={() => goBack(() => goToReviewOrigin(reviewOrigin))}
        onBookOpen={(bookId) =>
          openBook(bookId, "review", currentRoute({ screen: "review", selectedReviewId }))
        }
        onCreate={() => setCreateOpen(true)}
        onCommentCreate={saveCreatedComment}
        onNavigate={navigateRoot}
        onToggleCommentLike={toggleCommentLike}
        onToggleReviewLike={toggleReviewLike}
        onToggleSave={toggleReviewSave}
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "review", selectedReviewId }))}
      />
    );
  }

  if (screen === "profile") {
    return withCreateSheet(
      <ProfileScreen
        key={selectedUserId}
        userId={selectedUserId}
        lists={allLists}
        followedUserIds={followedUserIds}
        initialTab={profileInitialTab}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onBookOpen={(bookId) =>
          openBook(bookId, "profile", currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))
        }
        onCreate={() => setCreateOpen(true)}
        onEditProfile={() => openEditProfile(currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))}
        onInteractionsOpen={() => openInteractions(currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))}
        onConnectionsOpen={(userId, initialTab) =>
          openConnections(userId, initialTab, currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))
        }
        onListOpen={(listId) =>
          openList(listId, "profile", currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))
        }
        onNavigate={navigateRoot}
        onTabChange={setProfileInitialTab}
        onToggleFollow={toggleFollow}
        onReviewOpen={(reviewId, origin = "reviews") =>
          openReview(reviewId, origin, currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))
        }
        profileOverride={profileOverride}
        ratings={createdRatings}
        reviews={allReviews}
      />
    );
  }

  if (screen === "interactions") {
    return withCreateSheet(
      <InteractionsScreen
        likedCommentIds={likedCommentIds}
        likedReviewIds={likedReviewIds}
        comments={allComments}
        lists={allLists}
        reviews={allReviews}
        savedListIds={savedListIds}
        savedReviewIds={savedReviewIds}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onBookOpen={(bookId) =>
          openBook(bookId, "interactions", currentRoute({ screen: "interactions" }))
        }
        onCreate={() => setCreateOpen(true)}
        onListOpen={(listId) =>
          openList(listId, "interactions", currentRoute({ screen: "interactions" }))
        }
        onNavigate={navigateRoot}
        onReviewOpen={(reviewId, origin = "reviews") =>
          openReview(reviewId, origin, currentRoute({ screen: "interactions" }))
        }
      />
    );
  }

  if (screen === "editProfile") {
    return withCreateSheet(
      <EditProfileScreen
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onSave={(nextProfile) => {
          setProfileOverride(nextProfile);
          goBack(() => goHome(homeInitialTab));
        }}
        profileOverride={profileOverride}
      />
    );
  }

  if (screen === "connections") {
    return withCreateSheet(
      <ConnectionsScreen
        userId={selectedConnectionsUserId}
        initialTab={connectionsInitialTab}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onUserOpen={(userId) =>
          openUser(userId, currentRoute({ screen: "connections", selectedConnectionsUserId }))
        }
      />
    );
  }

  return (
    <LoginScreen
      onCreateAccount={() => navigateRoot("register")}
      onLogin={() => goHome("books")}
    />
  );
}
