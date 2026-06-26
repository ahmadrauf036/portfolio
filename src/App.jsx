import { useEffect, useState } from "react";
import {
    FileText,
    FileCode,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    X,
    Menu as MenuIcon,
    Mail,
    Phone,
    MapPin,
    GitBranch,
    Check,
    ExternalLink,
    Files,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens (kept as plain JS — Tailwind's predefined utilities only
// cover layout/spacing here; exact colors are applied via inline style)
// ---------------------------------------------------------------------------
const C = {
    bg: "#0d1117",
    panel: "#11151c",
    panelAlt: "#0a0d12",
    border: "#21262d",
    borderSoft: "#1c2129",
    text: "#c9d1d9",
    textDim: "#8b949e",
    muted: "#6e7681",
    purple: "#c792ea",
    green: "#89ca78",
    blue: "#82aaff",
    orange: "#f78c6c",
    amber: "#ffcb6b",
    red: "#f47067",
};

const MONO =
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// ---------------------------------------------------------------------------
// File metadata
// ---------------------------------------------------------------------------
const FILES = {
    "about.md": { label: "about.md", lang: "Markdown", color: C.blue },
    "skills.ts": { label: "skills.ts", lang: "TypeScript", color: C.orange },
    "projects/ledgerIQ.tsx": {
        label: "ledgerIQ.tsx",
        lang: "TypeScript JSX",
        color: C.blue,
    },
    "projects/transnova.tsx": {
        label: "transnova.tsx",
        lang: "TypeScript JSX",
        color: C.blue,
    },
    "projects/menu360.tsx": {
        label: "menu360.tsx",
        lang: "TypeScript JSX",
        color: C.blue,
    },
    "education.md": { label: "education.md", lang: "Markdown", color: C.blue },
    "contact.ts": { label: "contact.ts", lang: "TypeScript", color: C.orange },
};

const PROJECT_ORDER = [
    "projects/ledgerIQ.tsx",
    "projects/transnova.tsx",
    "projects/menu360.tsx",
];

// FileIcon renders a literal icon tag chosen via switch — avoids passing a
// lucide icon component reference through props/variables, which is what
// triggered the "Cannot read properties of undefined (reading 'map')" crash.
function FileIcon({ id, size = 14 }) {
    const color = (FILES[id] && FILES[id].color) || C.muted;
    if (id === "about.md" || id === "education.md") {
        return <FileText size={size} style={{ color, flexShrink: 0 }} />;
    }
    return <FileCode size={size} style={{ color, flexShrink: 0 }} />;
}

// Same idea for the contact row icons.
function ContactIcon({ type, size = 13, color }) {
    switch (type) {
        case "email":
            return <Mail size={size} style={{ color }} />;
        case "phone":
            return <Phone size={size} style={{ color }} />;
        case "location":
            return <MapPin size={size} style={{ color }} />;
        case "linkedin":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z" />
                </svg>
            );
        case "github":
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
                </svg>
            );
        default:
            return null;
    }
}

// ---------------------------------------------------------------------------
// Small syntax-highlight helpers
// ---------------------------------------------------------------------------
const Kw = ({ children }) => (
    <span style={{ color: C.purple }}>{children}</span>
);
const Str = ({ children }) => (
    <span style={{ color: C.green }}>{children}</span>
);
const Ident = ({ children }) => (
    <span style={{ color: C.blue }}>{children}</span>
);
const Punct = ({ children }) => (
    <span style={{ color: C.textDim }}>{children}</span>
);
const Com = ({ children }) => (
    <span style={{ color: C.muted }}>{children}</span>
);

function CodeLine({ n, children }) {
    return (
        <div className="flex" style={{ minHeight: "1.6rem" }}>
            <span
                className="select-none text-right pr-4 shrink-0"
                style={{
                    color: C.muted,
                    width: "2.75rem",
                    fontSize: "0.8rem",
                    lineHeight: "1.6rem",
                }}
            >
                {n}
            </span>
            <span
                style={{
                    fontSize: "0.85rem",
                    lineHeight: "1.6rem",
                    whiteSpace: "pre-wrap",
                }}
            >
                {children}
            </span>
        </div>
    );
}

function Tag({ children }) {
    return (
        <span
            className="inline-block rounded px-2 py-0.5 mr-1.5 mb-1.5"
            style={{
                backgroundColor: "rgba(137,202,120,0.1)",
                color: C.green,
                fontSize: "0.72rem",
                border: `1px solid rgba(137,202,120,0.25)`,
            }}
        >
            "{children}"
        </span>
    );
}

// ---------------------------------------------------------------------------
// File content renderers
// ---------------------------------------------------------------------------
function AboutContent() {
    return (
        <div
            className="px-6 md:px-10 py-8 max-w-2xl"
            style={{ fontFamily: SANS }}
        >
            <p
                className="mb-1"
                style={{
                    color: C.muted,
                    fontFamily: MONO,
                    fontSize: "0.78rem",
                }}
            >
                // README.md — rendered preview
            </p>
            <h1
                className="font-bold mb-1"
                style={{
                    color: C.text,
                    fontSize: "2rem",
                    letterSpacing: "-0.02em",
                }}
            >
                Ahmad Rauf
                <span
                    style={{
                        color: C.amber,
                        animation: "blink 1.1s steps(1) infinite",
                    }}
                >
                    _
                </span>
            </h1>
            <h2
                className="mb-6"
                style={{ color: C.blue, fontSize: "1.05rem", fontWeight: 500 }}
            >
                Full-Stack Developer · MERN + TypeScript
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: C.text }}>
                I'm a BSCS graduate from Lahore, Pakistan, who builds web
                platforms end to end — schema design, REST APIs, and the
                interfaces people actually use. My work ranges from a
                multi-tenant bookkeeping engine with real double-entry
                accounting, to an AR-enabled SaaS that lets restaurants show 3D
                dishes in a customer's own room.
            </p>
            <p className="mb-6 leading-relaxed" style={{ color: C.textDim }}>
                I like systems with sharp edges: strict role-based access,
                real-time validation, data that has to balance. Outside of
                client work I keep shipping personal projects to stay fluent in
                the stack — React, Next.js, Node, and Postgres, mostly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                    { label: "Location", value: "Lahore, Pakistan" },
                    { label: "Education", value: "BSCS, 2022–2026" },
                    {
                        label: "Languages",
                        value: "Urdu (native), English (fluent)",
                    },
                    { label: "Focus", value: "MERN · TypeScript · Postgres" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded px-3 py-2"
                        style={{
                            backgroundColor: C.panel,
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        <div
                            style={{
                                color: C.muted,
                                fontFamily: MONO,
                                fontSize: "0.68rem",
                            }}
                        >
                            {item.label}
                        </div>
                        <div style={{ color: C.text, fontSize: "0.85rem" }}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsContent() {
    return (
        <div className="px-2 md:px-4 py-6" style={{ fontFamily: MONO }}>
            <CodeLine n={1}>
                <Kw>const</Kw> <Ident>skills</Ident> <Punct>=</Punct>{" "}
                <Punct>{"{"}</Punct>
            </CodeLine>
            <CodeLine n={2}>
                &nbsp;&nbsp;languages<Punct>:</Punct> <Punct>[</Punct>
                <Str>"JavaScript"</Str>
                <Punct>,</Punct> <Str>"TypeScript"</Str>
                <Punct>,</Punct> <Str>"HTML"</Str>
                <Punct>,</Punct> <Str>"CSS"</Str>
                <Punct>,</Punct> <Str>"C/C++"</Str>
                <Punct>],</Punct>
            </CodeLine>
            <CodeLine n={3}>
                &nbsp;&nbsp;frameworks<Punct>:</Punct> <Punct>[</Punct>
                <Str>"React"</Str>
                <Punct>,</Punct> <Str>"Next.js"</Str>
                <Punct>,</Punct> <Str>"Node.js"</Str>
                <Punct>,</Punct> <Str>"Express"</Str>
                <Punct>,</Punct> <Str>"Tailwind CSS"</Str>
                <Punct>,</Punct> <Str>"Prisma ORM"</Str>
                <Punct>],</Punct>
            </CodeLine>
            <CodeLine n={4}>
                &nbsp;&nbsp;databases<Punct>:</Punct> <Punct>[</Punct>
                <Str>"PostgreSQL"</Str>
                <Punct>,</Punct> <Str>"MongoDB"</Str>
                <Punct>,</Punct> <Str>"MySQL"</Str>
                <Punct>,</Punct> <Str>"Supabase"</Str>
                <Punct>],</Punct>
            </CodeLine>
            <CodeLine n={5}>
                <Punct>{"};"}</Punct>
            </CodeLine>
            <CodeLine n={6}>&nbsp;</CodeLine>
            <CodeLine n={7}>
                <Com>
                    // also comfortable with Supabase Auth/Storage, Vercel &
                    Render deploys
                </Com>
            </CodeLine>
            <CodeLine n={8}>
                <Kw>export</Kw> <Kw>default</Kw> <Ident>skills</Ident>
                <Punct>;</Punct>
            </CodeLine>
        </div>
    );
}

function ProjectHeader({ title, subtitle, link }) {
    return (
        <div className="mb-5">
            <div className="flex items-baseline gap-3 flex-wrap">
                <h3
                    className="font-bold"
                    style={{ color: C.text, fontSize: "1.4rem" }}
                >
                    {title}
                </h3>
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                        style={{
                            color: C.amber,
                            fontSize: "0.78rem",
                            fontFamily: MONO,
                        }}
                    >
                        live demo <ExternalLink size={12} />
                    </a>
                )}
            </div>
            <p
                style={{
                    color: C.muted,
                    fontFamily: MONO,
                    fontSize: "0.78rem",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
}

function Bullet({ children }) {
    return (
        <li
            className="mb-2.5 leading-relaxed flex gap-2"
            style={{ color: C.text, fontSize: "0.92rem" }}
        >
            <span style={{ color: C.green, fontFamily: MONO, flexShrink: 0 }}>
                ▸
            </span>
            <span>{children}</span>
        </li>
    );
}

function LedgerIQContent() {
    return (
        <div
            className="px-6 md:px-10 py-8 max-w-2xl"
            style={{ fontFamily: SANS }}
        >
            <ProjectHeader
                title="LedgerIQ"
                subtitle="Multi-tenant bookkeeping platform · Personal / freelance"
            />
            <div className="mb-5">
                {[
                    "React",
                    "TypeScript",
                    "Tailwind CSS",
                    "Node.js",
                    "Express",
                    "PostgreSQL (Supabase)",
                    "Supabase Auth & Storage",
                    "Resend",
                    "Vercel",
                    "Render",
                ].map((t) => (
                    <Tag key={t}>{t}</Tag>
                ))}
            </div>
            <ul>
                <Bullet>
                    Three-tier role-based access (Admin, Client Owner,
                    Bookkeeper) with data isolation enforced at the database
                    level via PostgreSQL Row-Level Security.
                </Bullet>
                <Bullet>
                    A full double-entry accounting engine: multi-line journal
                    entries, approval workflows, and real-time debit/credit
                    validation.
                </Bullet>
                <Bullet>
                    Live-computed financial reports — Trial Balance, Profit
                    &amp; Loss, Balance Sheet — with automated balance
                    verification baked in.
                </Bullet>
                <Bullet>
                    A secure document-sharing module on Supabase Storage, with
                    inline PDF previews and time-limited signed URLs.
                </Bullet>
                <Bullet>
                    Owned the project end to end — requirements, schema design,
                    REST API, and production hosting.
                </Bullet>
            </ul>
        </div>
    );
}

function TransnovaContent() {
    return (
        <div
            className="px-6 md:px-10 py-8 max-w-2xl"
            style={{ fontFamily: SANS }}
        >
            <ProjectHeader
                title="Transnova"
                subtitle="Logistics & fleet management platform · Final year project"
            />
            <div className="mb-5">
                {["TypeScript", "MongoDB", "React", "Node.js", "Express"].map(
                    (t) => (
                        <Tag key={t}>{t}</Tag>
                    ),
                )}
            </div>
            <ul>
                <Bullet>
                    Architected backend APIs in Node.js and Express to handle
                    logistics, authentication, and fleet management workflows.
                </Bullet>
                <Bullet>
                    Built the central admin dashboard in React and TypeScript
                    for fleet data management, with an interface designed for
                    non-technical staff.
                </Bullet>
                <Bullet>
                    Coordinated cross-platform system design so data stayed in
                    sync between the web dashboard and a companion React Native
                    mobile app.
                </Bullet>
            </ul>
        </div>
    );
}

function Menu360Content() {
    return (
        <div
            className="px-6 md:px-10 py-8 max-w-2xl"
            style={{ fontFamily: SANS }}
        >
            <ProjectHeader
                title="Menu360"
                subtitle="AR-enabled digital menu SaaS · Self-learning project"
                link="https://menu360.co/aos-restaurant"
            />
            <div className="mb-5">
                {[
                    "Next.js",
                    "TypeScript",
                    "PostgreSQL",
                    "Supabase",
                    "Prisma ORM",
                    "Tailwind CSS",
                ].map((t) => (
                    <Tag key={t}>{t}</Tag>
                ))}
            </div>
            <ul>
                <Bullet>
                    Built the frontend for a SaaS platform that lets restaurants
                    publish interactive 3D menus for their diners.
                </Bullet>
                <Bullet>
                    Integrated 3D models with web-based AR, so a customer can
                    preview a dish in their own space before ordering.
                </Bullet>
                <Bullet>
                    Tuned Next.js asset loading to improve page-load speed
                    across mobile and desktop.
                </Bullet>
                <Bullet>
                    Built a reusable component library for cross-browser
                    consistency, working closely with backend and UI/UX
                    collaborators.
                </Bullet>
            </ul>
        </div>
    );
}

function EducationContent() {
    return (
        <div
            className="px-6 md:px-10 py-8 max-w-2xl"
            style={{ fontFamily: SANS }}
        >
            <p
                className="mb-4"
                style={{
                    color: C.muted,
                    fontFamily: MONO,
                    fontSize: "0.78rem",
                }}
            >
                // education.md — rendered preview
            </p>
            <div className="mb-6">
                <h3
                    className="font-semibold"
                    style={{ color: C.text, fontSize: "1.1rem" }}
                >
                    BS Computer Science
                </h3>
                <p style={{ color: C.blue, fontSize: "0.88rem" }}>
                    University of Central Punjab, Lahore
                </p>
                <p
                    style={{
                        color: C.muted,
                        fontFamily: MONO,
                        fontSize: "0.78rem",
                    }}
                >
                    2022 — 2026
                </p>
            </div>
            <div>
                <h3
                    className="font-semibold"
                    style={{ color: C.text, fontSize: "1.1rem" }}
                >
                    FSc Pre-Engineering
                </h3>
                <p style={{ color: C.blue, fontSize: "0.88rem" }}>
                    Punjab College of Science, B.I.S.E Lahore
                </p>
                <p
                    style={{
                        color: C.muted,
                        fontFamily: MONO,
                        fontSize: "0.78rem",
                    }}
                >
                    2020 — 2022
                </p>
            </div>
        </div>
    );
}

function ContactContent() {
    const rows = [
        {
            key: "email",
            value: "ahmadrauf036@gmail.com",
            href: "mailto:ahmadrauf036@gmail.com",
        },
        { key: "phone", value: "+92-311-0300388", href: "tel:+923110300388" },
        { key: "location", value: "Lahore, Pakistan", href: null },
        {
            key: "linkedin",
            value: "linkedin.com/in/ahmadrauf",
            href: "https://linkedin.com/in/ahmadrauf",
        },
        {
            key: "github",
            value: "github.com/ahmadrauf036",
            href: "https://github.com/ahmadrauf036",
        },
    ];
    return (
        <div className="px-2 md:px-4 py-6" style={{ fontFamily: MONO }}>
            <CodeLine n={1}>
                <Kw>const</Kw> <Ident>contact</Ident> <Punct>=</Punct>{" "}
                <Punct>{"{"}</Punct>
            </CodeLine>
            {rows.map((r, i) => (
                <CodeLine n={i + 2} key={r.key}>
                    &nbsp;&nbsp;{r.key}
                    <Punct>:</Punct>{" "}
                    {r.href ? (
                        <a
                            href={r.href}
                            target={
                                r.href.startsWith("http") ? "_blank" : undefined
                            }
                            rel="noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1.5"
                            style={{ color: C.green }}
                        >
                            <ContactIcon
                                type={r.key}
                                size={13}
                                color={C.muted}
                            />
                            "{r.value}"
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-1.5">
                            <ContactIcon
                                type={r.key}
                                size={13}
                                color={C.muted}
                            />
                            <Str>"{r.value}"</Str>
                        </span>
                    )}
                    <Punct>,</Punct>
                </CodeLine>
            ))}
            <CodeLine n={rows.length + 2}>
                <Punct>{"};"}</Punct>
            </CodeLine>
            <CodeLine n={rows.length + 3}>&nbsp;</CodeLine>
            <CodeLine n={rows.length + 4}>
                <Com>// always open to new projects and full-time roles</Com>
            </CodeLine>
            <CodeLine n={rows.length + 5}>
                <Kw>export</Kw> <Kw>default</Kw> <Ident>contact</Ident>
                <Punct>;</Punct>
            </CodeLine>
        </div>
    );
}

function renderContent(id) {
    switch (id) {
        case "about.md":
            return <AboutContent />;
        case "skills.ts":
            return <SkillsContent />;
        case "projects/ledgerIQ.tsx":
            return <LedgerIQContent />;
        case "projects/transnova.tsx":
            return <TransnovaContent />;
        case "projects/menu360.tsx":
            return <Menu360Content />;
        case "education.md":
            return <EducationContent />;
        case "contact.ts":
            return <ContactContent />;
        default:
            return null;
    }
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function SidebarRow({ id, active, onClick, indent = 0 }) {
    const label = FILES[id] ? FILES[id].label : id;
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-2 py-1 text-left rounded-sm"
            style={{
                paddingLeft: `${0.75 + indent * 1.1}rem`,
                paddingRight: "0.5rem",
                backgroundColor: active
                    ? "rgba(130,170,255,0.12)"
                    : "transparent",
                borderLeft: active
                    ? `2px solid ${C.blue}`
                    : "2px solid transparent",
            }}
        >
            <FileIcon id={id} size={14} />
            <span
                style={{
                    color: active ? C.text : C.textDim,
                    fontSize: "0.82rem",
                }}
            >
                {label}
            </span>
        </button>
    );
}

function Sidebar({
    activeFile,
    openFile,
    projectsExpanded,
    setProjectsExpanded,
    mobileOpen,
    setMobileOpen,
}) {
    const topLevel = ["about.md", "skills.ts"];
    const bottomLevel = ["education.md", "contact.ts"];
    useEffect(() => {
        console.log(mobileOpen);
    }, [mobileOpen]);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 md:hidden"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div
                className={`fixed md:relative inset-y-0 left-0 z-40 w-64 shrink-0 flex flex-col
    bg-[#0a0d12] border-r border-[#21262d]
    transition-transform duration-200 md:translate-x-0
    ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div
                    className="px-3 py-2 flex items-center justify-between md:hidden"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                >
                    <span
                        style={{
                            color: C.muted,
                            fontSize: "0.75rem",
                            fontFamily: MONO,
                        }}
                    >
                        EXPLORER
                    </span>
                    <button onClick={() => setMobileOpen(false)}>
                        <X size={16} style={{ color: C.muted }} />
                    </button>
                </div>
                <div
                    className="px-3 pt-3 pb-1 hidden md:block"
                    style={{
                        color: C.muted,
                        fontSize: "0.7rem",
                        letterSpacing: "0.08em",
                        fontFamily: MONO,
                    }}
                >
                    EXPLORER
                </div>
                <div
                    className="px-2 pt-1 pb-1 flex items-center gap-1.5"
                    style={{ color: C.textDim, fontSize: "0.82rem" }}
                >
                    <FolderOpen size={14} style={{ color: C.amber }} />
                    <span style={{ fontWeight: 600 }}>portfolio</span>
                </div>
                <div className="overflow-y-auto pb-3" style={{ flex: 1 }}>
                    {topLevel.map((id) => (
                        <SidebarRow
                            key={id}
                            id={id}
                            active={activeFile === id}
                            onClick={() => openFile(id)}
                            indent={1}
                        />
                    ))}

                    <button
                        onClick={() => setProjectsExpanded(!projectsExpanded)}
                        className="w-full flex items-center gap-1 py-1 text-left"
                        style={{
                            paddingLeft: "0.75rem",
                            color: C.textDim,
                            fontSize: "0.82rem",
                        }}
                    >
                        {projectsExpanded ? (
                            <ChevronDown size={13} />
                        ) : (
                            <ChevronRight size={13} />
                        )}
                        {projectsExpanded ? (
                            <FolderOpen size={14} style={{ color: C.amber }} />
                        ) : (
                            <Folder size={14} style={{ color: C.amber }} />
                        )}
                        <span>projects</span>
                    </button>
                    {projectsExpanded &&
                        PROJECT_ORDER.map((id) => (
                            <SidebarRow
                                key={id}
                                id={id}
                                active={activeFile === id}
                                onClick={() => openFile(id)}
                                indent={2}
                            />
                        ))}

                    <div className="mt-1">
                        {bottomLevel.map((id) => (
                            <SidebarRow
                                key={id}
                                id={id}
                                active={activeFile === id}
                                onClick={() => openFile(id)}
                                indent={1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
function Tabs({ openTabs, activeFile, openFile, closeTab }) {
    return (
        <div
            className="flex items-stretch overflow-x-auto"
            style={{
                backgroundColor: C.panelAlt,
                borderBottom: `1px solid ${C.border}`,
            }}
        >
            {openTabs.map((id) => {
                const meta = FILES[id];
                const isActive = id === activeFile;
                return (
                    <div
                        key={id}
                        onClick={() => openFile(id)}
                        className="flex items-center gap-2 px-3 cursor-pointer shrink-0 group"
                        style={{
                            backgroundColor: isActive ? C.bg : "transparent",
                            borderRight: `1px solid ${C.border}`,
                            borderTop: isActive
                                ? `2px solid ${C.blue}`
                                : "2px solid transparent",
                            minHeight: "2.25rem",
                        }}
                    >
                        <FileIcon id={id} size={13} />
                        <span
                            style={{
                                color: isActive ? C.text : C.textDim,
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {meta.label}
                        </span>
                        <button
                            onClick={(e) => closeTab(id, e)}
                            className="rounded hover:opacity-100"
                            style={{
                                opacity: isActive ? 0.8 : 0.3,
                                padding: "1px",
                            }}
                        >
                            <X size={12} style={{ color: C.muted }} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Title bar & status bar
// ---------------------------------------------------------------------------
function TitleBar({ setMobileOpen }) {
    return (
        <div
            className="flex items-center justify-between px-3 shrink-0"
            style={{
                height: "2.25rem",
                backgroundColor: C.panelAlt,
                borderBottom: `1px solid ${C.border}`,
            }}
        >
            <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                    <span
                        className="rounded-full"
                        style={{
                            width: 11,
                            height: 11,
                            backgroundColor: C.red,
                        }}
                    />
                    <span
                        className="rounded-full"
                        style={{
                            width: 11,
                            height: 11,
                            backgroundColor: C.amber,
                        }}
                    />
                    <span
                        className="rounded-full"
                        style={{
                            width: 11,
                            height: 11,
                            backgroundColor: C.green,
                        }}
                    />
                </div>
                <span
                    className="hidden sm:inline"
                    style={{
                        color: C.muted,
                        fontSize: "0.78rem",
                        fontFamily: MONO,
                    }}
                >
                    ahmad-rauf — portfolio.code-workspace
                </span>
            </div>
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
                <Files size={18} style={{ color: C.textDim }} />
            </button>
        </div>
    );
}

function StatusBar({ activeFile }) {
    const meta = activeFile ? FILES[activeFile] : null;
    return (
        <div
            className="flex items-center justify-between px-3 shrink-0"
            style={{
                height: "1.5rem",
                backgroundColor: C.blue,
                fontSize: "0.7rem",
                fontFamily: MONO,
            }}
        >
            <div
                className="flex items-center gap-3"
                style={{ color: "#0a0d12" }}
            >
                <span className="flex items-center gap-1">
                    <GitBranch size={11} /> main
                </span>
                <span className="hidden sm:flex items-center gap-1">
                    <Check size={11} /> available for work
                </span>
            </div>
            <div
                className="flex items-center gap-3"
                style={{ color: "#0a0d12" }}
            >
                <span className="hidden sm:inline">UTF-8</span>
                <span>{meta ? meta.lang : "—"}</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ openFile }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <FileCode size={32} style={{ color: C.border }} />
            <p className="mt-3" style={{ color: C.muted, fontSize: "0.85rem" }}>
                No file open.
            </p>
            <button
                onClick={() => openFile("about.md")}
                className="mt-3 rounded px-3 py-1.5"
                style={{
                    border: `1px solid ${C.border}`,
                    color: C.blue,
                    fontSize: "0.8rem",
                }}
            >
                Open about.md
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Portfolio() {
    const [activeFile, setActiveFile] = useState("about.md");
    const [openTabs, setOpenTabs] = useState(["about.md"]);
    const [projectsExpanded, setProjectsExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    function openFile(id) {
        setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
        setActiveFile(id);
        setMobileOpen(false);
    }

    function closeTab(id, e) {
        e.stopPropagation();
        setOpenTabs((prev) => {
            const idx = prev.indexOf(id);
            const next = prev.filter((t) => t !== id);
            if (activeFile === id) {
                const fallback = next[idx] || next[idx - 1] || null;
                setActiveFile(fallback);
            }
            return next;
        });
    }

    return (
        <div
            className="h-screen w-full flex flex-col overflow-hidden"
            style={{ backgroundColor: C.bg, color: C.text, fontFamily: MONO }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${C.panelAlt}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 6px; }
        button:focus-visible, a:focus-visible {
          outline: 2px solid ${C.blue};
          outline-offset: 2px;
        }
      `}</style>

            <TitleBar setMobileOpen={setMobileOpen} />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    activeFile={activeFile}
                    openFile={openFile}
                    projectsExpanded={projectsExpanded}
                    setProjectsExpanded={setProjectsExpanded}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Tabs
                        openTabs={openTabs}
                        activeFile={activeFile}
                        openFile={openFile}
                        closeTab={closeTab}
                    />
                    <div className="flex-1 overflow-y-auto">
                        {activeFile ? (
                            renderContent(activeFile)
                        ) : (
                            <EmptyState openFile={openFile} />
                        )}
                    </div>
                </div>
            </div>

            <StatusBar activeFile={activeFile} />
        </div>
    );
}
