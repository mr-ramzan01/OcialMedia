import { Box, IconButton, InputBase, Paper, Stack } from "@mui/material";
import { useContext, useMemo, useRef, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { AppShell, PageHeader } from "../components/layout/AppShell";
import { EmptyState } from "../components/common/EmptyState";
import { SectionCard } from "../components/common/SectionCard";
import { UserListItem } from "../components/common/UserListItem";
import { UserRowSkeleton } from "../components/common/Skeletons";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import { usePageTitle } from "../hooks/usePageTitle";

function debounce(fn, delay) {
  let id;
  return () => {
    clearTimeout(id);
    id = setTimeout(() => {
      fn();
    }, delay);
  };
}

export const Search = () => {
  usePageTitle("Search");
  const toast = useToast();
  const searchRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { userToken } = useContext(AuthContext);

  const SearchInput = useMemo(
    () =>
      debounce(() => {
        setSearching(true);
        api(`/api/users/search?q=${searchRef.current.value}`, {
          token: userToken,
        })
          .then((res) => {
            if (res && res.success === false) {
              toast.error(res.message || "Something went wrong");
            }
            setUsers(res.data);
          })
          .catch((err) => {
            toast.error("Something went wrong");
            console.log(err, "search error");
          })
          .finally(() => setSearching(false));
      }, 500),
    [userToken, toast],
  );

  const handleRemoveInput = () => {
    searchRef.current.value = "";
    setQuery("");
    SearchInput();
  };

  const handleInput = () => {
    setQuery(searchRef.current.value);
    SearchInput();
  };

  const hasQuery = query.length > 0;
  const results = Array.isArray(users) ? users : [];

  return (
    <AppShell width="feed">
      <PageHeader
        title="Search"
        subtitle="Find friends and creators on Ocial Media"
      />
      <Stack spacing={2}>
        <Paper
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
          }}
        >
          <Box
            sx={{ display: "flex", color: "text.secondary", pl: 0.5, pr: 1 }}
          >
            <IoSearchOutline size={20} />
          </Box>
          <InputBase
            sx={{ flex: 1, py: 0.5 }}
            onInput={handleInput}
            autoFocus
            inputRef={searchRef}
            placeholder="Search in Ocial Media"
            slotProps={{ input: { "aria-label": "Search in Ocial Media" } }}
          />
          <IconButton
            onClick={handleRemoveInput}
            type="button"
            size="small"
            aria-label="search"
            sx={{
              color: "text.secondary",
              visibility: hasQuery ? "visible" : "hidden",
            }}
          >
            <IoCloseOutline size={20} />
          </IconButton>
        </Paper>

        {!hasQuery ? (
          <EmptyState
            image="/Images/paint.gif"
            title="Find people"
            subtitle="Search by name or username"
          />
        ) : searching ? (
          <SectionCard sx={{ p: 1 }}>
            <UserRowSkeleton count={4} />
          </SectionCard>
        ) : results.length > 0 ? (
          <SectionCard sx={{ p: 1 }}>
            <Stack spacing={0.25}>
              {results.map((el) => (
                <UserListItem key={el._id} user={el} />
              ))}
            </Stack>
          </SectionCard>
        ) : (
          <EmptyState
            image="/Images/profile-search.gif"
            title="No people found"
            subtitle="Try a different name or username."
          />
        )}
      </Stack>
    </AppShell>
  );
};
