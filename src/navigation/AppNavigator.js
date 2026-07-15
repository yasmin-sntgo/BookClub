import { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

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
import { ProfileShelfScreen } from "../screens/ProfileShelfScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ReviewDetailScreen } from "../screens/ReviewDetailScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { ShelfScreen } from "../screens/ShelfScreen";
import { useLists, useNotifications, useProfile, useReviews, useShelf } from "../hooks";

export function AppNavigator() {
  const [screen, setScreen] = useState("login");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("dune");
  const [selectedCreateBookId, setSelectedCreateBookId] = useState(null);
  const [selectedListId, setSelectedListId] = useState("before-die");
  const [editingListId, setEditingListId] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState("review-1");
  const [selectedShelfBookId, setSelectedShelfBookId] = useState(null);
  const [selectedShelfUserId, setSelectedShelfUserId] = useState("lia");
  const [selectedUserId, setSelectedUserId] = useState("lia");
  const [selectedConnectionsUserId, setSelectedConnectionsUserId] = useState("yasmin");
  const [homeInitialTab, setHomeInitialTab] = useState("books");
  const [profileInitialTab, setProfileInitialTab] = useState("Resenhas");
  const [searchInitialTab, setSearchInitialTab] = useState("Livros");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionsInitialTab, setConnectionsInitialTab] = useState("Seguidores");
  const [interactionsInitialTab, setInteractionsInitialTab] = useState("Curtidas");
  const [shelfInitialFilter, setShelfInitialFilter] = useState("Todos");
  const [createOrigin, setCreateOrigin] = useState("home");
  const [bookOrigin, setBookOrigin] = useState("home");
  const [listOrigin, setListOrigin] = useState("lists");
  const [reviewOrigin, setReviewOrigin] = useState("reviews");
  const {
    currentUserHandle,
    followedUserIds,
    profileOverride,
    registeredAccount,
    registerAccount,
    saveProfile,
    toggleFollow,
    users
  } = useProfile();
  const {
    saveShelfEntry: persistShelfEntry,
    setBookShelfStatus,
    setShelfPrivate,
    shelfEntries,
    shelfPrivate,
    toggleBookFavorite
  } = useShelf();
  const {
    createList,
    deleteList,
    editList,
    lists: allLists,
    savedListIds,
    setListPrivacy,
    toggleListSave
  } = useLists({ currentUserHandle, profileOverride });
  const {
    allComments,
    allReviews,
    createdRatings,
    deleteComment,
    deleteRating,
    deleteReview,
    editComment,
    editReview,
    likedCommentIds,
    likedReviewIds,
    revealSpoilerReview,
    revealedSpoilerReviewIds,
    savedReviewIds,
    saveCreatedComment,
    saveCreatedReview: persistCreatedReview,
    toggleCommentLike,
    toggleReviewLike,
    toggleReviewSave
  } = useReviews({ currentUserHandle, profileOverride });
  const {
    markAllNotificationsRead,
    markNotificationRead,
    notificationPreferences,
    notifications: visibleNotifications,
    readNotificationIds,
    toggleNotificationPreference,
    unreadNotificationsCount
  } = useNotifications();
  const [history, setHistory] = useState([]);
  const transitionKey = useMemo(
    () =>
      [
        screen,
        selectedBookId,
        selectedListId,
        selectedReviewId,
        selectedUserId,
        selectedShelfUserId,
        selectedConnectionsUserId
      ].join(":"),
    [
      screen,
      selectedBookId,
      selectedListId,
      selectedReviewId,
      selectedUserId,
      selectedShelfUserId,
      selectedConnectionsUserId
    ]
  );

  function currentRoute(overrides = {}) {
    return {
      screen,
      selectedBookId,
      selectedCreateBookId,
      selectedListId,
      selectedReviewId,
      selectedShelfBookId,
      selectedShelfUserId,
      selectedUserId,
      selectedConnectionsUserId,
      homeInitialTab,
      profileInitialTab,
      searchInitialTab,
      searchQuery,
      connectionsInitialTab,
      interactionsInitialTab,
      shelfInitialFilter,
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
    setSelectedShelfUserId(route.selectedShelfUserId ?? "lia");
    setSelectedUserId(route.selectedUserId ?? "lia");
    setSelectedConnectionsUserId(route.selectedConnectionsUserId ?? "yasmin");
    setHomeInitialTab(route.homeInitialTab ?? "books");
    setProfileInitialTab(route.profileInitialTab ?? "Resenhas");
    setSearchInitialTab(route.searchInitialTab ?? "Livros");
    setSearchQuery(route.searchQuery ?? "");
    setConnectionsInitialTab(route.connectionsInitialTab ?? "Seguidores");
    setInteractionsInitialTab(route.interactionsInitialTab ?? "Curtidas");
    setShelfInitialFilter(route.shelfInitialFilter ?? "Todos");
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
    if (nextScreen === "home") {
      setHomeInitialTab("books");
    }
    if (nextScreen === "library") {
      setShelfInitialFilter("Todos");
    }
    if (nextScreen === "search") {
      setSearchInitialTab("Livros");
      setSearchQuery("");
    }
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
    setInteractionsInitialTab("Curtidas");
    setScreen("interactions");
  }

  function openSettings(previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setScreen("settings");
  }

  function openProfileShelf(userId, previousRoute = currentRoute()) {
    if (userId === "yasmin") {
      navigateRoot("library");
      return;
    }

    pushRoute(previousRoute);
    setSelectedShelfUserId(userId);
    setScreen("profileShelf");
  }

  function openAddToShelf(bookId = null, previousRoute = currentRoute()) {
    setSelectedShelfBookId(bookId);
    setCreateOpen(false);
    pushRoute(previousRoute);
    setScreen("addToShelf");
  }

  function openCreateList(previousRoute = currentRoute()) {
    setCreateOpen(false);
    setEditingListId(null);
    pushRoute(previousRoute);
    setScreen("createList");
  }

  function openEditList(listId, previousRoute = currentRoute()) {
    setCreateOpen(false);
    setEditingListId(listId);
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

  function saveShelfEntry(nextEntry) {
    persistShelfEntry(nextEntry);
    setSelectedShelfBookId(null);
    navigateRoot("library");
  }

  function openSearchByGenre(genre, previousRoute = currentRoute()) {
    pushRoute(previousRoute);
    setSearchInitialTab("Livros");
    setSearchQuery(genre);
    setScreen("search");
  }

  function saveCreatedList(listDraft) {
    if (listDraft.id) {
      const nextList = editList(listDraft);

      setSelectedListId(nextList.id);
      setEditingListId(null);
      setHistory((current) => current.slice(0, -1));
      setScreen("listDetail");
      return;
    }

    const nextList = createList(listDraft);

    setSelectedListId(nextList.id);
    setListOrigin("lists");
    setHistory([]);
    setScreen("listDetail");
  }

  function saveCreatedReview(reviewDraft) {
    const result = persistCreatedReview(reviewDraft);

    if (result.type === "rating") {
      setSelectedBookId(result.bookId);
      setHistory((current) => current.slice(0, -1));
      setScreen(createOrigin === "bookRatings" ? "bookRatings" : "book");
      return;
    }

    setSelectedReviewId(result.reviewId);
    setHomeInitialTab("reviews");
    setScreen("review");
  }

  function withCreateSheet(content) {
    return (
      <>
        <ScreenReveal transitionKey={transitionKey}>{content}</ScreenReveal>
        <CreateActionSheet visible={createOpen} onClose={handleCreateAction} />
      </>
    );
  }

  if (screen === "register") {
    return (
      <ScreenReveal transitionKey={transitionKey}>
        <RegisterScreen
          onCreateAccount={(account) => {
            registerAccount(account);
            navigateRoot("login");
          }}
          onLogin={() => navigateRoot("login")}
        />
      </ScreenReveal>
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
        revealedSpoilerReviewIds={revealedSpoilerReviewIds}
        savedReviewIds={savedReviewIds}
        users={users}
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
        onSpoilerReveal={revealSpoilerReview}
        onUserOpen={(userId) => openUser(userId, currentRoute({ screen: "home", homeInitialTab }))}
        unreadNotificationsCount={unreadNotificationsCount}
      />
    );
  }

  if (screen === "library") {
    return withCreateSheet(
      <ShelfScreen
        initialFilter={shelfInitialFilter}
        shelfEntries={shelfEntries}
        onAddToShelf={() => openAddToShelf(null, currentRoute({ screen: "library" }))}
        onBookOpen={(bookId) =>
          openBook(bookId, "library", currentRoute({ screen: "library", shelfInitialFilter }))
        }
        onCreate={() => setCreateOpen(true)}
        onFilterChange={setShelfInitialFilter}
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
        users={users}
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
        key={editingListId ?? "new-list"}
        list={editingListId ? allLists.find((list) => list.id === editingListId) : null}
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
        onDelete={(listId) => {
          deleteList(listId);
          goBack(() => navigateRoot("lists"));
        }}
        onEdit={(listId) =>
          openEditList(listId, currentRoute({ screen: "listDetail", selectedListId }))
        }
        onNavigate={navigateRoot}
        onPrivacyChange={setListPrivacy}
        onToggleSave={toggleListSave}
      />
    );
  }

  if (screen === "notifications") {
    return withCreateSheet(
      <NotificationsScreen
        notifications={visibleNotifications}
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
        users={users}
        likedReviewIds={likedReviewIds}
        revealedSpoilerReviewIds={revealedSpoilerReviewIds}
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
        onRatingDelete={(bookId) => deleteRating(bookId)}
        onSpoilerReveal={revealSpoilerReview}
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
        comments={allComments}
        likedReviewIds={likedReviewIds}
        revealedSpoilerReviewIds={revealedSpoilerReviewIds}
        reviews={allReviews}
        users={users}
        onBack={() => goBack(goToBook)}
        onCreate={() => setCreateOpen(true)}
        onCreateReview={(bookId) =>
          openCreateReview(bookId, "review", "bookReviews", currentRoute({ screen: "bookReviews", selectedBookId }))
        }
        onNavigate={navigateRoot}
        onSpoilerReveal={revealSpoilerReview}
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
        currentUserHandle={currentUserHandle}
        reviews={allReviews}
        users={users}
        onBack={() => goBack(() => goToReviewOrigin(reviewOrigin))}
        onBookOpen={(bookId) =>
          openBook(bookId, "review", currentRoute({ screen: "review", selectedReviewId }))
        }
        onCreate={() => setCreateOpen(true)}
        onCommentCreate={saveCreatedComment}
        onCommentDelete={deleteComment}
        onCommentEdit={editComment}
        onNavigate={navigateRoot}
        onReviewDelete={(reviewId) => {
          deleteReview(reviewId);
          goBack(() => goHome("reviews"));
        }}
        onReviewEdit={editReview}
        onSpoilerReveal={revealSpoilerReview}
        revealedSpoilerReviewIds={revealedSpoilerReviewIds}
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
        onSettingsOpen={() => openSettings(currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))}
        onShelfOpen={(userId) =>
          openProfileShelf(userId, currentRoute({ screen: "profile", selectedUserId, profileInitialTab }))
        }
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
        shelfPrivate={shelfPrivate}
      />
    );
  }

  if (screen === "interactions") {
    return withCreateSheet(
      <InteractionsScreen
        initialTab={interactionsInitialTab}
        likedCommentIds={likedCommentIds}
        likedReviewIds={likedReviewIds}
        comments={allComments}
        lists={allLists}
        reviews={allReviews}
        savedListIds={savedListIds}
        savedReviewIds={savedReviewIds}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onBookOpen={(bookId) =>
          openBook(bookId, "interactions", currentRoute({ screen: "interactions", interactionsInitialTab }))
        }
        onCreate={() => setCreateOpen(true)}
        onListOpen={(listId) =>
          openList(listId, "interactions", currentRoute({ screen: "interactions", interactionsInitialTab }))
        }
        onNavigate={navigateRoot}
        onTabChange={setInteractionsInitialTab}
        onReviewOpen={(reviewId, origin = "reviews") =>
          openReview(reviewId, origin, currentRoute({ screen: "interactions", interactionsInitialTab }))
        }
      />
    );
  }

  if (screen === "profileShelf") {
    return withCreateSheet(
      <ProfileShelfScreen
        privateShelf={selectedShelfUserId === "yasmin" && shelfPrivate}
        userId={selectedShelfUserId}
        shelfEntries={shelfEntries}
        users={users}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onBookOpen={(bookId) =>
          openBook(bookId, "profileShelf", currentRoute({ screen: "profileShelf", selectedShelfUserId }))
        }
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
      />
    );
  }

  if (screen === "settings") {
    return withCreateSheet(
      <SettingsScreen
        notificationPreferences={notificationPreferences}
        onBack={() => goBack(() => goHome(homeInitialTab))}
        onCreate={() => setCreateOpen(true)}
        onNavigate={navigateRoot}
        onNotificationPreferenceChange={toggleNotificationPreference}
        onShelfPrivacyChange={setShelfPrivate}
        shelfPrivate={shelfPrivate}
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
          saveProfile(nextProfile);
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
        followedUserIds={followedUserIds}
        users={users}
        onNavigate={navigateRoot}
        onTabChange={setConnectionsInitialTab}
        onToggleFollow={toggleFollow}
        onUserOpen={(userId) =>
          openUser(userId, currentRoute({ screen: "connections", selectedConnectionsUserId, connectionsInitialTab }))
        }
      />
    );
  }

  return (
    <ScreenReveal transitionKey={transitionKey}>
      <LoginScreen
        accountNotice={registeredAccount ? "Conta criada. Entre com seu e-mail e senha para continuar." : ""}
        initialEmail={registeredAccount?.email ?? ""}
        onCreateAccount={() => navigateRoot("register")}
        onLogin={() => goHome("books")}
      />
    </ScreenReveal>
  );
}

function ScreenReveal({ children, transitionKey }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0.96);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 110,
      useNativeDriver: true
    }).start();
  }, [opacity, transitionKey]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {children}
    </Animated.View>
  );
}
