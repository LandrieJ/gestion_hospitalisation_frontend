import { ExpandLess, ExpandMore, MenuOpenRounded } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiTogetAll } from "../../utils/ApiServices";
import { UserContext } from "../../utils/UserContext";

export const SousMenuBox = ({chuUser, theData = [] ,hidden ,handleOpenCloseMenu, hide,}) => {

  const [openMenus, setOpenMenus] = useState({});
  const [services, setServices] = useState([]);
  const { user } = useContext(UserContext);

  const handleToggle = (text) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

const fetchHospital = async () => {
  const servicesData = await apiTogetAll("services/lists/");
  setServices(servicesData.results || []);
};

const isSuperAdmin =
  user?.is_superuser || user?.user_type === "super_admin";

const userServices = isSuperAdmin
  ? services
  : services.filter(
      (service) => service?.hospital === user?.hospital?.id
    );

const filtredtheData = isSuperAdmin
  ? theData
  : theData.filter(
      (d) =>
        d.type !== "service" ||
        userServices.some((s) => s.name === d?.id)
    );

  useEffect(() => {
    fetchHospital();
  }, []);

  return (
    <Box
      hidden={hidden}
      sx={{
        display: { xs: "none", sm: "none", md: "flex" },
        flexDirection: "column",
        width: 230,
        mt: 1,
        ml: 1,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
    >
      <Box
        className={"bg-color-primary"}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
          height: 65,
          color: "white",
          borderRadius: 2,
        }}
      >
        <IconButton
          hidden={hide}
          className="text-color-white"
          sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          onClick={handleOpenCloseMenu}
        >
          <MenuOpenRounded />
        </IconButton>
        <Box>
          <Typography fontSize={14} noWrap>
            CHU {chuUser || "AUCUN"}
          </Typography>
          <Typography fontSize={11} noWrap>
            Ministère de la Santé Publique
          </Typography>
        </Box>
      </Box>

      {/* Menu List */}
      <List component="nav" sx={{ mt: 1 }}>
        {filtredtheData.length > 0 ? (
          filtredtheData.map((data) => (
            <Box key={data.text}>
              <ListItem disablePadding sx={{ px: 1, pb: 1 }}>
                <ListItemButton
                  onClick={
                    data.children.length > 0
                      ? () => handleToggle(data.text)
                      : null
                  }
                  component={data.children.length === 0 ? NavLink : "div"}
                  to={
                    data.children.length === 0
                      ? data.link.toLowerCase()
                      : undefined
                  }
                  sx={{
                    color: "text.primary",
                    textDecoration: "none",
                    borderRadius: 2,
                    px: 1,
                    transition: "all 0.3s ease-in-out",
                    "&.active": {
                      backgroundColor: "rgba(156, 39, 89, 0.2)",
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {data.children.length > 0 ? (
                    openMenus[data.text] ? (
                      <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                        <ExpandLess />
                      </ListItemIcon>
                    ) : (
                      <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                        <ExpandMore />
                      </ListItemIcon>
                    )
                  ) : (
                    <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                      <data.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography fontSize={14}>{data.text}</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              {data.children.length > 0 && (
                <Collapse
                  in={openMenus[data.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    {data.children.map((child) => (
                      <ListItem key={child.text} disablePadding>
                        <ListItemButton
                          component={NavLink}
                          to={child.link.toLowerCase()}
                          sx={{
                            color: "text.primary",
                            textDecoration: "none",
                            borderRadius: 2,
                            px: 1,
                            "&.active": {
                              backgroundColor: "rgba(156, 39, 89, 0.2)",
                            },
                            "&:hover": {
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                            <child.icon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>
                            <Typography fontSize={13}>{child.text}</Typography>
                          </ListItemText>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))
        ) : (
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
          >
            Aucun élément disponible
          </Typography>
        )}
      </List>
    </Box>
  );
};

export const SousMenuDraw = ({
  handleDrawerOpen,
  open,
  chuUser,
  theData = [],
}) => {
  const [openMenus, setOpenMenus] = useState({});
  const [services, setServices] = useState([]);
  const { user } = useContext(UserContext);

  const fetchHospital = async () => {
    try {
      const servicesData = await apiTogetAll("services/lists/");
      setServices(servicesData.results || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setServices([]);
    }
  };

  // Safe filtering with optional chaining
  const isSuperAdmin =
    user?.is_superuser || user?.user_type === "super_admin";

  const userServices = isSuperAdmin
    ? services
    : services.filter(
        (service) => service?.hospital === user?.hospital?.id
      );

  const filtredtheData = theData.filter(
    (d) =>
      d.type !== "service" ||
      userServices.some((s) => s.name === d?.id)
  );

  useEffect(() => {
    fetchHospital();
  }, []);

  const handleToggle = (text) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: 230,
          bgcolor: "#F4F6F8",
          boxShadow:
            "6px 6px 12px rgba(0, 0, 0, 0.05), -4px -4px 8px rgba(255, 255, 255, 0.7)",
          border: "1px solid #E0E0E0",
          transition: "all 0.3s ease-in-out",
        },
        display: { xs: "flex", sm: "flex", md: "none" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          className={"bg-color-primary"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            height: 65,
            color: "white",
          }}
        >
          <Avatar
            alt="Logo"
            src="/logoMinistere.png"
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography fontSize={14} noWrap>
              CHU {chuUser || "AUCUN"}
            </Typography>
            <Typography fontSize={11} noWrap>
              Ministère de la Santé Publique
            </Typography>
          </Box>
        </Box>

        <List component="nav" sx={{ mt: 1 }}>
          {filtredtheData.length > 0 ? (
            filtredtheData.map((data) => (
              <Box key={data.text}>
                <ListItem disablePadding sx={{ px: 1, pb: 1 }}>
                  <ListItemButton
                    onClick={
                      data.children.length > 0
                        ? () => handleToggle(data.text)
                        : () => handleDrawerOpen()
                    }
                    component={data.children.length === 0 ? NavLink : "div"}
                    to={
                      data.children.length === 0
                        ? data.link?.toLowerCase()
                        : undefined
                    }
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      borderRadius: 2,
                      px: 1,
                      transition: "all 0.3s ease-in-out",
                      "&.active": {
                        backgroundColor: "rgba(156, 39, 89, 0.2)",
                      },
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {data.children.length > 0 ? (
                      openMenus[data.text] ? (
                        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                          <ExpandLess />
                        </ListItemIcon>
                      ) : (
                        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                          <ExpandMore />
                        </ListItemIcon>
                      )
                    ) : (
                      <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                        <data.icon fontSize="small" />
                      </ListItemIcon>
                    )}
                    <ListItemText>
                      <Typography fontSize={14}>{data.text}</Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>

                {data.children.length > 0 && (
                  <Collapse
                    in={openMenus[data.text]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding sx={{ pl: 4 }}>
                      {data.children.map((child) => (
                        <ListItem key={child.text} disablePadding>
                          <ListItemButton
                            onClick={() => handleDrawerOpen()}
                            component={NavLink}
                            to={child.link?.toLowerCase()}
                            sx={{
                              color: "text.primary",
                              textDecoration: "none",
                              borderRadius: 2,
                              px: 1,
                              "&.active": {
                                backgroundColor: "rgba(156, 39, 89, 0.2)",
                              },
                              "&:hover": {
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                              <child.icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography fontSize={13}>
                                {child.text}
                              </Typography>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))
          ) : (
            <Typography
              sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
            >
              Aucun élément disponible
            </Typography>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
