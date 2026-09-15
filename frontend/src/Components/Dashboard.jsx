import { useEffect, useRef, useState } from "react";
import logo from "../assets/victinet.png";
import { Search, Sun, Moon,Bell,Workflow,Calendar,CalendarDays,Plus,ChevronDown,ChevronUp,Menu,User,ClipboardCheck,Megaphone,HandCoins,Users,X,Clock3,BriefcaseBusiness,Database,BarChart3,Home,Trash2,Pencil,Save,Download,Grid3X3,UserCheck,WalletCards,Target,FileText,MessageSquare,TrendingUp} from "lucide-react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "./Dashboard.css"
const iconOptions = [
  {
    name: "grid",
    icon: Grid3X3
  },
  {
    name: "clock",
    icon: Clock3
  },
  {
    name: "users",
    icon: Users
  },
  {
    name: "calendar",
    icon: Calendar
  },
  {
    name: "briefcase",
    icon: BriefcaseBusiness
  },
  {
    name: "database",
    icon: Database
  },
  {
    name: "chart",
    icon: BarChart3
  },
  {
    name: "attendance",
    icon: UserCheck
  },
  {
    name: "payroll",
    icon: WalletCards
  },
  {
    name: "target",
    icon: Target
  },
  {
    name: "document",
    icon: FileText
  },
  {
    name: "message",
    icon: MessageSquare
  },
  {
    name: "performance",
    icon: TrendingUp
  }
];

const getIcon = (name) => {
  const item = iconOptions.find(
    (item) => item.name === name
  );

  return item ? item.icon : Grid3X3;
};

const getTodayDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

const initialEmployees = [
  {
    empid: 1,
    empname: "Kishore",
    attendance: "Absent",
    role: "Intern"
  },
  {
    empid: 2,
    empname: "Kowshik",
    attendance: "Present",
    role: "Developer"
  },
  {
    empid: 3,
    empname: "Vijay",
    attendance: "Present",
    role: "SEO"
  },
  {
    empid: 4,
    empname: "Harish",
    attendance: "Absent",
    role: "Tester"
  },
  {
    empid: 5,
    empname: "Babu",
    attendance: "Present",
    role: "Analyst"
  }
];

const cardLibrary = [
  {
    id: "attendance",
    title: "Attendance",
    value: "85%",
    icon: "attendance"
  },
  {
    id: "employees",
    title: "Employees",
    value: "25",
    icon: "users"
  },
   {
    id: "performance",
    title: "Performance",
    value: "92%",
    icon: "performance",
    type: "chart",
    chartData: [52, 76, 49, 82, 65, 18, 90, 12]
  },
  {
    id: "goals",
    title: "Goals",
    value: "8",
    icon: "target"
  },
  {
    id: "documents",
    title: "Documents",
    value: "36",
    icon: "document"
  },
  {
    id: "messages",
    title: "Messages",
    value: "14",
    icon: "message"
  },
  {
    id: "analytics",
    title: "Analytics",
    value: "Live",
    icon: "chart"
  },
  {
    id: "leave",
    title: "Leave",
    value: "4",
    icon: "calendar"
  }
];

const defaultCards = [
  {
    id: "schedule",
    title: "Total Schedule",
    value: "156",
    date: getTodayDate(),
    icon: "calendar",
    builtIn: true
  },
  {
    id: "workhours",
    title: "Avg WorkHours",
    value: "8 hrs",
    date: "",
    icon: "clock",
    builtIn: true
  },
  {
    id: "present",
    title: "Total Present",
    value: "3",
    date: "",
    icon: "users",
    builtIn: true
  },
  {
    id: "total-workhours",
    title: "Total WorkHours",
    value: "1248 hrs",
    date: "",
    icon: "clock",
    builtIn: true
  },
  {
    id: "payroll",
    title: "Total PayRoll",
    value: "₹1,20,200",
    date: "",
    icon: "database",
    builtIn: true
  }
];

function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [showAddCard, setShowAddCard] = useState(false);

  const [employees] = useState(initialEmployees);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const [libraryDragCard, setLibraryDragCard] =
    useState(null);

  const [dropTargetIndex, setDropTargetIndex] =
    useState(null);

  const [dragPosition, setDragPosition] = useState({
    x: 0,
    y: 0
  });

  const dragRef = useRef(null);

  const pointerPositionRef = useRef({
    x: 0,
    y: 0
  });

  const username =
    localStorage.getItem("username") || "Sriram";

  const presentCount = employees.filter(
    (employee) =>
      employee.attendance === "Present"
  ).length;

  const [cards, setCards] = useState(() => {
    try {
      const saved =
        localStorage.getItem("dashboardCards");

      if (!saved) {
        return defaultCards;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return defaultCards;
      }

      const defaultIds = new Set(
        defaultCards.map((card) => card.id)
      );

      const cleanedCards = parsed.filter((card) => {
        if (card.builtIn) {
          return defaultIds.has(card.id);
        }

        return true;
      });

      return cleanedCards;
    } catch {
      return defaultCards;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "dashboardCards",
      JSON.stringify(cards)
    );
  }, [cards]);

  useEffect(() => {
    setCards((previous) =>
      previous.map((card) => {
        if (card.id === "present") {
          return {
            ...card,
            value: presentCount.toString()
          };
        }

        if (card.id === "schedule") {
          return {
            ...card,
            date: getTodayDate()
          };
        }

        return card;
      })
    );
  }, [presentCount]);

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );

    return () => {
      document.body.classList.remove(
        "dark-mode"
      );
    };
  }, [darkMode]);

  const getDropTarget = (x, y) => {
    const element = document.elementFromPoint(
      x,
      y
    );

    if (!element) {
      return null;
    }

    const dashboardCard =
      element.closest(
        "[data-dashboard-card]"
      );

    if (dashboardCard) {
      const index = Number(
        dashboardCard.getAttribute(
          "data-dashboard-card"
        )
      );

      if (!Number.isNaN(index)) {
        return index;
      }
    }

    const placeholder =
      element.closest(
        "[data-dashboard-placeholder]"
      );

    if (placeholder) {
      return cards.length;
    }

    return null;
  };

  const startLibraryDrag = (
    event,
    card
  ) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const position = {
      x: event.clientX,
      y: event.clientY
    };s
    pointerPositionRef.current =
      position;

    dragRef.current = {
      type: "library",
      card
    };

    setLibraryDragCard(card);
    setDragPosition(position);
    setDropTargetIndex(null);

    document.body.classList.add(
      "custom-drag-active"
    );
  };

  const addLibraryCard = (
    libraryCard,
    index
  ) => {
    setCards((previous) => {
      const exists = previous.some(
        (card) =>
          card.libraryId ===
          libraryCard.id
      );

      if (exists) {
        return previous;
      }
const newCard = {
  id: `custom-${Date.now()}`,
  libraryId: libraryCard.id,
  title: libraryCard.title,
  value: libraryCard.value,
  date: "",
  icon: libraryCard.icon,
  type: libraryCard.type || "normal",
  chartData: libraryCard.chartData || [],
  builtIn: false
};

      const updated = [
        ...previous
      ];

      const safeIndex = Math.max(
        0,
        Math.min(
          index,
          updated.length
        )
      );

      updated.splice(
        safeIndex,
        0,
        newCard
      );

      return updated;
    });

    dragRef.current = null;

    setLibraryDragCard(null);
    setDropTargetIndex(null);
    setShowAddCard(false);

    document.body.classList.remove(
      "custom-drag-active"
    );
  };

  const finishLibraryDrag = () => {
    const currentDrag =
      dragRef.current;

    if (
      !currentDrag ||
      currentDrag.type !==
        "library"
    ) {
      return;
    }

    const {
      x,
      y
    } = pointerPositionRef.current;

    const targetIndex =
      getDropTarget(x, y);

    if (
      targetIndex !== null &&
      targetIndex !== undefined
    ) {
      addLibraryCard(
        currentDrag.card,
        targetIndex
      );

      return;
    }

    dragRef.current = null;

    setLibraryDragCard(null);
    setDropTargetIndex(null);

    document.body.classList.remove(
      "custom-drag-active"
    );
  };

  useEffect(() => {
    if (!libraryDragCard) {
      return;
    }

    const handlePointerMove = (
      event
    ) => {
      const position = {
        x: event.clientX,
        y: event.clientY
      };

      pointerPositionRef.current =
        position;

      setDragPosition(position);

      const targetIndex =
        getDropTarget(
          event.clientX,
          event.clientY
        );

      setDropTargetIndex(
        targetIndex
      );
    };

    const handlePointerUp = () => {
      finishLibraryDrag();
    };

    const handlePointerCancel = () => {
      dragRef.current = null;

      setLibraryDragCard(null);
      setDropTargetIndex(null);
      setShowAddCard(false);

      document.body.classList.remove(
        "custom-drag-active"
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    window.addEventListener(
      "pointercancel",
      handlePointerCancel
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      window.removeEventListener(
        "pointercancel",
        handlePointerCancel
      );
    };
  }, [
    libraryDragCard,
    cards.length
  ]);

  const startExistingDrag = (
    event,
    index
  ) => {
    if (!editMode) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );

    setDraggedIndex(index);
  };

  const handleExistingDragOver = (
    event
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  };

  const handleExistingDrop = (
    event,
    targetIndex
  ) => {
    event.preventDefault();

    if (draggedIndex === null) {
      return;
    }

    if (
      draggedIndex ===
      targetIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    setCards((previous) => {
      const updated = [
        ...previous
      ];

      const moved =
        updated[draggedIndex];

      updated.splice(
        draggedIndex,
        1
      );

      let newIndex =
        targetIndex;

      if (
        draggedIndex <
        targetIndex
      ) {
        newIndex =
          targetIndex - 1;
      }

      updated.splice(
        newIndex,
        0,
        moved
      );

      return updated;
    });

    setDraggedIndex(null);
  };

  const handleExistingDragEnd =
    () => {
      setDraggedIndex(null);
    };

  const deleteCard = (id) => {
    setCards((previous) =>
      previous.filter(
        (card) =>
          card.id !== id
      )
    );
  };

  const openAddCard = () => {
    setShowAddCard(true);
  };

  const closeAddCard = () => {
    dragRef.current = null;

    setShowAddCard(false);
    setLibraryDragCard(null);
    setDropTargetIndex(null);

    document.body.classList.remove(
      "custom-drag-active"
    );
  };

  const renderPage = () => {
    if (
      activePage === "Dashboard"
    ) {
      return (
        <DashboardHome
          username={username}
          cards={cards}
          editMode={editMode}
          setEditMode={
            setEditMode
          }
          openAddCard={
            openAddCard
          }
          deleteCard={
            deleteCard
          }
          startExistingDrag={
            startExistingDrag
          }
          handleExistingDragOver={
            handleExistingDragOver
          }
          handleExistingDrop={
            handleExistingDrop
          }
          handleExistingDragEnd={
            handleExistingDragEnd
          }
          libraryDragCard={
            libraryDragCard
          }
          dropTargetIndex={
            dropTargetIndex
          }
        />
      );
    }

    if (
      activePage === "Employee"
    ) {
      return (
        <EmployeePage
          employees={employees}
        />
      );
    }

    if (
      activePage === "Attendance"
    ) {
      return (
        <AttendancePage
          employees={employees}
        />
      );
    }

    if (
      activePage === "Schedule"
    ) {
      return (
        <SimplePage
          title="Schedule"
          icon={
            <CalendarDays />
          }
        />
      );
    }

    if (
      activePage === "WorkSpace"
    ) {
      return (
        <SimplePage
          title="WorkSpace"
          icon={
            <Workflow />
          }
        />
      );
    }

    if (
      activePage === "Announcement"
    ) {
      return (
        <SimplePage
          title="Announcement"
          icon={
            <Megaphone />
          }
        />
      );
    }

    if (
      activePage ===
      "Pay Management"
    ) {
      return (
        <SimplePage
          title="Pay Management"
          icon={
            <HandCoins />
          }
        />
      );
    }

    if (
      activePage ===
      "Team Directory"
    ) {
      return (
        <SimplePage
          title="Team Directory"
          icon={
            <Users />
          }
        />
      );
    }

    return null;
  };

  return (
    <div className="app">
      <header className={`topbar ${collapse ? "topbar-collapsed" : "topbar-expanded"}`} >
        <div className="topbar-left">

          <div className="today-date">
            <Calendar size={15} />
            {getTodayDate()}
          </div>

          <div className="search-box">
            <Search size={20} />

            <input
              placeholder="Search-box"
            />
          </div>
        </div>

        <div className="topbar-right">
          <button
            className="icon-button"
            onClick={() =>
              setDarkMode(false)
            }
          >
            <Sun size={18} />
          </button>

          <button
            className="icon-button"
            onClick={() =>
              setDarkMode(true)
            }
          >
            <Moon size={18} />
          </button>

          <button className="icon-button">
            <Bell size={18} />
          </button>

          <div className="avatar">
            {username
              .charAt(0)
              .toUpperCase()}
          </div>
        </div>
      </header>

      <aside
        className={`sidebar ${
          collapse
            ? "collapsed"
            : ""
        }`}
      >
        <div className="sidebar_logo_icon">
      <img src={logo} alt="" />
    </div>
  <div className="sidebar-logo">
  <div className="sidebar-logo-icon">
      <User size={30}  strokeWidth = {2.75} className="user-icon" />
  </div>

  <div className="sidebar-logo-text">
    <h6>HRMS</h6>
    <span>Employee Portal</span>
  </div>
</div>
 
        <button
          className="menu-button"
          onClick={() =>
            setCollapse(
              !collapse
            )
          }
        >
          <Menu size={20} />
        </button>

        <div className="sidebar-dropdown">
          <span>
            Dashboard
          </span>

          <ChevronUp size={16} />
        </div>

        <SidebarItem
          icon={
            <Home
              size={20}
            />
          }
          label="My Dashboard"
          active={
            activePage ===
            "Dashboard"
          }
          onClick={() =>
            setActivePage(
              "Dashboard"
            )
          }
        />

        <SidebarItem
          icon={
            <ClipboardCheck
              size={20}
            />
          }
          label="Attendance"
          active={
            activePage ===
            "Attendance"
          }
          onClick={() =>
            setActivePage(
              "Attendance"
            )
          }
        />

        <SidebarItem
          icon={
            <User size={20} />
          }
          label="Employee"
          active={
            activePage ===
            "Employee"
          }
          onClick={() =>
            setActivePage(
              "Employee"
            )
          }
        />

        <SidebarItem
          icon={
            <CalendarDays
              size={20}
            />
          }
          label="Schedule"
          active={
            activePage ===
            "Schedule"
          }
          onClick={() =>
            setActivePage(
              "Schedule"
            )
          }
        />

        <SidebarItem
          icon={
            <Workflow size={20} />
          }
          label="WorkSpace"
          active={
            activePage ===
            "WorkSpace"
          }
          onClick={() =>
            setActivePage(
              "WorkSpace"
            )
          }
        />

        <SidebarItem
          icon={
            <Megaphone
              size={20}
            />
          }
          label="Announcement"
          active={
            activePage ===
            "Announcement"
          }
          onClick={() =>
            setActivePage(
              "Announcement"
            )
          }
        />

        <SidebarItem
          icon={
            <HandCoins
              size={20}
            />
          }
          label="Pay Management"
          active={
            activePage ===
            "Pay Management"
          }
          onClick={() =>
            setActivePage(
              "Pay Management"
            )
          }
        />

        <SidebarItem
          icon={
            <Users size={20} />
          }
          label="Team Directory"
          active={
            activePage ===
            "Team Directory"
          }
          onClick={() =>
            setActivePage(
              "Team Directory"
            )
          }
        />

        <div className="sidebar-section">
          <div className="section-title">
            <span>
              Department
            </span>

            <ChevronDown
              size={15}
            />
          </div>

          <div className="section-title">
            <span>
              Others
            </span>

            <ChevronDown
              size={15}
            />
          </div>
        </div>

        <div className="profile-box">
          <div className="profile-avatar">
            {username
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <strong>
              {username}
            </strong>

            <span>
              Admin
            </span>
          </div>

          <ChevronUp size={15} />
        </div>
      </aside>

      <main
        className={`main-content ${
          collapse
            ? "expanded"
            : ""
        }`}
      >
        {renderPage()}
      </main>

      {showAddCard && (
        <CardLibraryModal
          cards={cards}
          onClose={closeAddCard}
          onPointerDown={
            startLibraryDrag
          }
          draggedCard={
            libraryDragCard
          }
        />
      )}

      {libraryDragCard && (
        <div
          className="floating-drag-card"
          style={{
            left:
              dragPosition.x +
              15,
            top:
              dragPosition.y +
              15
          }}
        >
          <div className="floating-drag-icon">
            {(() => {
              const Icon =
                getIcon(
                  libraryDragCard.icon
                );

              return (
                <Icon size={22} />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardHome({
  username,
  cards,
  editMode,
  setEditMode,
  openAddCard,
  deleteCard,
  startExistingDrag,
  handleExistingDragOver,
  handleExistingDrop,
  handleExistingDragEnd,
  libraryDragCard,
  dropTargetIndex
}) {
  return (
    <div className="dashboard-home">
      <div className="dashboard-heading">
        <h1>
          Hi {username},
        </h1>

        <div className="dashboard-actions">
          <button
            className="secondary-button"
            onClick={() =>
              setEditMode(
                !editMode
              )
            }
          >
            {editMode ? (
              <>
                <Save size={15} />
                Save
              </>
            ) : (
              <>
                <Pencil size={15} />
                Edit
              </>
            )}
          </button>

          <button
            className="add-button"
            onClick={
              openAddCard
            }
          >
            <Plus size={20} />
          </button>

          <button className="secondary-button">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {libraryDragCard && (
        <div className="drag-instruction">
          <Grid3X3 size={20} />

          <span>
            Drop "
            {libraryDragCard.title}
            " on a dashboard
            card
          </span>
        </div>
      )}

      <div
        className={`dashboard-grid ${
          libraryDragCard
            ? "library-drag-active"
            : ""
        }`}
      >
        {cards.map(
          (card, index) => (
            <DashboardCard
              key={card.id}
              card={card}
              index={index}
              editMode={editMode}
              isDropTarget={
                libraryDragCard &&
                dropTargetIndex ===
                  index
              }
              deleteCard={
                deleteCard
              }
              startExistingDrag={
                startExistingDrag
              }
              handleExistingDragOver={
                handleExistingDragOver
              }
              handleExistingDrop={
                handleExistingDrop
              }
              handleExistingDragEnd={
                handleExistingDragEnd
              }
            />
          )
        )}

        {libraryDragCard && (
          <div
            className={`dashboard-drop-placeholder ${
              dropTargetIndex ===
              cards.length
                ? "active-drop"
                : ""
            }`}
            data-dashboard-placeholder="true"
          >
            <Plus size={25} />

            <span>
              Drop here
            </span>
          </div>
        )}

        {editMode &&
          !libraryDragCard && (
            <div
              className="dashboard-drop-placeholder"
              data-dashboard-placeholder="true"
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) =>
                handleExistingDrop(
                  event,
                  cards.length
                )
              }
            >
              <Plus size={24} />

              <span>
                Drop card here
              </span>
            </div>
          )}
      </div>
    </div>
  );
}

function DashboardCard({
  card,
  index,
  editMode,
  isDropTarget,
  deleteCard,
  startExistingDrag,
  handleExistingDragOver,
  handleExistingDrop,
  handleExistingDragEnd
}) {
  const Icon = getIcon(
    card.icon
  );

  return (
    <div
      className={`dashboard-card ${
        editMode
          ? "edit-card"
          : ""
      } ${
        isDropTarget
          ? "library-drop-target"
          : ""
      }`}
      data-dashboard-card={
        index
      }
      draggable={editMode}
      onDragStart={(event) =>
        startExistingDrag(
          event,
          index
        )
      }
      onDragOver={
        handleExistingDragOver
      }
      onDrop={(event) =>
        handleExistingDrop(
          event,
          index
        )
      }
      onDragEnd={
        handleExistingDragEnd
      }
    >
      <div className="card-decoration top"></div>

      <div className="card-decoration bottom"></div>
      
      <div className="card-decoration bottom1"></div>

      <div className="card-content">
        <div className="card-title-row">
          <span>
            {card.title}
          </span>

          <div className="card-icon">
            <Icon size={20} />
          </div>
        </div>

        {card.type === "chart" ? (
  <PerformanceMiniChart
    data={card.chartData}
    value={card.value}
  />
) : (
  <>
    <div className="card-value">
      {card.value}
    </div>

    {card.date && (
      <div className="card-date">
        {card.date}
      </div>
    )}
  </>
)}
      </div>

      {editMode &&
        !card.builtIn && (
          <button
            className="delete-card-button"
            onClick={(event) => {
              event.stopPropagation();

              deleteCard(
                card.id
              );
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
    </div>
  );
}
function PerformanceMiniChart({ data, value }) {
  const max = Math.max(...data);

  return (
    <div className="performance-mini-chart">
      <div className="performance-chart-header">
        <span>Performance</span>
        <strong>{value}</strong>
      </div>

      <div className="performance-bar-chart">
        {data.map((item, index) => (
          <div className="performance-bar-item" key={index}>
            <div
              className="performance-bar"
              style={{
                height: `${(item / max) * 100}%`,
                backgroundColor: [
                  "#3b82f6",
                  "#8b5cf6",
                  "#ec4899",
                  "#f97316",
                  "#eab208",
                  "#22c55e",
                  "#06b6d4",
                  "#6366f1"
                ][index]
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="performance-chart-labels">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
      </div>
    </div>
  );
}
function CardLibraryModal({
  cards,
  onClose,
  onPointerDown,
  draggedCard
}) {
  const availableCards =
    cardLibrary.filter(
      (libraryCard) =>
        !cards.some(
          (card) =>
            card.libraryId ===
            libraryCard.id
        )
    );

  return (
    <div
      className={`modal-overlay ${
        draggedCard
          ? "library-dragging"
          : ""
      }`}
    >
      <div
        className="card-library-modal"
        onPointerDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="library-header">
          <div className="library-heading">
            <div className="library-main-icon">
              <Grid3X3 size={22} />
            </div>

            <div>
              <h2>
                Dashboard Apps
              </h2>

              <p>
                Drag an icon to your
                dashboard
              </p>
            </div>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="library-body">
          {availableCards.length ===
          0 ? (
            <div className="empty-library">
              <Grid3X3 size={35} />

              <h3>
                All cards added
              </h3>

              <p>
                All dashboard cards
                have already been
                added.
              </p>
            </div>
          ) : (
            <div className="card-library-grid">
              {availableCards.map(
                (card) => {
                  const Icon =
                    getIcon(
                      card.icon
                    );

                  return (
                    <div
                      key={card.id}
                      className={`library-card ${
                        draggedCard?.id ===
                        card.id
                          ? "selected-library-card"
                          : ""
                      }`}
                      onPointerDown={(
                        event
                      ) =>
                        onPointerDown(
                          event,
                          card
                        )
                      }
                    >
                      <div className="library-only-icon">
                        <Icon size={28} />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="library-footer">
          <div className="library-tip">
            <Grid3X3 size={16} />

            <span>
              Drag an icon to the
              dashboard
            </span>
          </div>

          <button
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick
}) {
  return (
    <button
      className={`sidebar-item ${
        active
          ? "active"
          : ""
      }`}
      onClick={onClick}
    >
      {icon}

      <span>
        {label}
      </span>
    </button>
  );
}

function EmployeePage({
  employees
}) {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>
            Employees
          </h2>

          <p>
            Employee management
          </p>
        </div>

        <button className="add-button">
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      <Table
        striped
        bordered
        hover
        responsive
        className="employeetable"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>
              Employee Name
            </th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(
            (employee) => (
              <tr
                key={
                  employee.empid
                }
              >
                <td>
                  {employee.empid}
                </td>

                <td>
                  {employee.empname}
                </td>

                <td>
                  {employee.role}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
}

function AttendancePage({
  employees
}) {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h2>
            Attendance
          </h2>

          <p>
            Today's employee
            attendance
          </p>
        </div>
      </div>

      <Table className="attendancetable"
        striped
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
            <th>
              Employee ID
            </th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(
            (employee) => (
              <tr
                key={
                  employee.empid
                }
              >
                <td>
                  {employee.empid}
                </td>

                <td>
                  {employee.empname}
                </td>
                <td
                  className={
                    employee.attendance ===
                    "Present"
                      ? "attendance-present"
                      : "attendance-absent"
                  }
                >
                  {
                    employee.attendance
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
}

function SimplePage({
  title,
  icon
}) {
  return (
    <div className="page-card simple-page">
      <div className="simple-page-icon">
        {icon}
      </div>

      <h2>
        {title}
      </h2>

      <p>
        This page is under
        development.
      </p>
    </div>
  );
}


export default Dashboard;