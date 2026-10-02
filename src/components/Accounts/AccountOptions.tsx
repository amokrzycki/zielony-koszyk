import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PasswordIcon from "@mui/icons-material/Password";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import type { ReactNode } from "react";
import { Roles } from "@/enums/Roles.ts";
import type User from "../../types/User.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";

interface AccountOption {
  icon: ReactNode;
  title: string;
  description: string;
  route: string;
}

interface AccountSection {
  label: string;
  options: AccountOption[];
}

const sections: AccountSection[] = [
  {
    label: "Zamówienia i dostawa",
    options: [
      {
        icon: <ShoppingBagIcon />,
        title: "Twoje zamówienia",
        description: "Historia i statusy Twoich zamówień.",
        route: "/konto/zamowienia",
      },
      {
        icon: <ImportContactsIcon />,
        title: "Książka adresowa",
        description: "Adresy dostawy i dane do rachunku.",
        route: "/konto/ksiazka-adresowa",
      },
    ],
  },
  {
    label: "Bezpieczeństwo",
    options: [
      {
        icon: <AlternateEmailIcon />,
        title: "Zmiana adresu email",
        description: "Zmień adres przypisany do konta.",
        route: "/konto/zmiana-email",
      },
      {
        icon: <PasswordIcon />,
        title: "Zmiana hasła",
        description: "Zaktualizuj hasło do konta.",
        route: "/konto/zmiana-hasla",
      },
      {
        icon: <SecurityIcon />,
        title: "Ustawienia MFA",
        description: "Dodatkowe potwierdzanie logowania.",
        route: "/konto/mfa",
      },
    ],
  },
];

const adminSection: AccountSection = {
  label: "Administracja",
  options: [
    {
      icon: <BuildIcon />,
      title: "Panel administratora",
      description: "Produkty, zamówienia i użytkownicy.",
      route: "/admin",
    },
  ],
};

const labelSx = {
  m: 0,
  mb: 1.25,
  color: "text.secondary",
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

function AccountRow({ option }: { option: AccountOption }) {
  return (
    <Box
      component={Link}
      to={option.route}
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: "14px",
        bgcolor: tone(theme, 0.05),
        color: "text.primary",
        textDecoration: "none",
        transition: `background-color 200ms ${EASE}`,
        "&:hover": { bgcolor: tone(theme, 0.11) },
        "&:hover .account-row-arrow": { transform: "translateX(4px)", color: accentText(theme) },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      })}>
      <Box
        aria-hidden
        sx={{
          display: "grid",
          placeItems: "center",
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: "50%",
          color: (t) => accentText(t),
          bgcolor: (t) => tone(t, 0.12),
          "& svg": { fontSize: 22 },
        }}>
        {option.icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>{option.title}</Typography>
        <Typography variant="body2" sx={{ mt: 0.25, color: "text.secondary", lineHeight: 1.45 }}>
          {option.description}
        </Typography>
      </Box>
      <ArrowForward
        className="account-row-arrow"
        sx={{
          fontSize: 20,
          flexShrink: 0,
          color: "text.secondary",
          transition: `transform 200ms ${EASE}, color 200ms ${EASE}`,
        }}
      />
    </Box>
  );
}

function AccountOptions() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);

  const visibleSections = user.role === Roles.ADMIN ? [...sections, adminSection] : sections;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "left" }}>
      <Typography
        component="h1"
        sx={{
          m: 0,
          fontSize: { xs: "1.7rem", md: "2.05rem" },
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}>
        Twoje konto
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary", maxWidth: "54ch", lineHeight: 1.6 }}>
        Zarządzaj zamówieniami, adresami dostawy i bezpieczeństwem konta.
      </Typography>

      {visibleSections.map((section) => (
        <Box component="section" key={section.label} sx={{ mt: { xs: 3.5, md: 4 } }}>
          <Typography component="h2" sx={labelSx}>
            {section.label}
          </Typography>
          <Box sx={{ display: "grid", gap: 1 }}>
            {section.options.map((option) => (
              <AccountRow key={option.route} option={option} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default AccountOptions;
