import { Book, MessageSquare, Camera, Layout, Users, Clock, Library, ShieldCheck, ArrowRight, Menu, X, Smartphone, Globe, CloudOff, Atom, Ruler, Zap, GraduationCap } from "lucide-react";

export const ICONS = {
  Book, MessageSquare, Camera, Layout, Users, Clock, Library, ShieldCheck, ArrowRight, Menu, X, Smartphone, Globe, CloudOff, Atom, Ruler, Zap, GraduationCap
} as const;

export const SUBJECTS = [
  { 
    name: "Mathematics", 
    image: "https://i.pinimg.com/1200x/7a/ea/e7/7aeae7deb6c022194a3a1156d8b4e301.jpg",
    description: "Master foundational and advanced mathematical concepts tailored for the GCE curriculum.",
    modules: [
      { 
        title: "Module 1: Algebra", 
        lessons: ["Variables and Expressions", "Linear Equations", "Inequalities", "Quadratic Equations"]
      },
      { 
        title: "Module 2: Geometry", 
        lessons: ["Angles and Lines", "Triangles and Polygons", "Circles", "Coordinate Geometry"]
      },
      { 
        title: "Module 3: Trigonometry", 
        lessons: ["SOH CAH TOA", "Trigonometric Graphs", "The Unit Circle"]
      }
    ],
    duration: "12 weeks",
    progress: 35
  },
  { 
    name: "Physics", 
    image: "https://i.pinimg.com/736x/16/b1/c7/16b1c753ce82346da7a30ea894b36791.jpg",
    description: "Explore the laws of nature, from mechanics to modern physics.",
    modules: [
      { title: "Module 1: Mechanics", lessons: ["Motion in a straight line", "Vectors and scalars", "Newton's Laws", "Energy and Work"] },
      { title: "Module 2: Waves", lessons: ["Wave properties", "Sound", "Light and Optics"] }
    ],
    duration: "10 weeks",
    progress: 12
  },
  { 
    name: "Chemistry", 
    image: "https://i.pinimg.com/736x/83/df/dc/83dfdc29a25376eb786313870631ef3f.jpg",
    description: "Understand the composition, structure, and properties of matter.",
    modules: [
      { title: "Module 1: Atomic Structure", lessons: ["Atoms and Isotopes", "Periodic Table", "Chemical Bonding"] },
      { title: "Module 2: Organic Chemistry", lessons: ["Hydrocarbons", "Alcohols", "Carboxylic Acids"] }
    ],
    duration: "10 weeks",
    progress: 0
  },
  { 
    name: "Biology", 
    image: "https://i.pinimg.com/1200x/93/40/66/93406652109210af99acd118477bab4a.jpg",
    description: "The study of living organisms and their interactions with the environment.",
    modules: [
      { title: "Module 1: Cell Biology", lessons: ["Cell structure", "Metabolism", "Cell division"] },
      { title: "Module 2: Human Physiology", lessons: ["Digestion", "Respiration", "Circulation"] }
    ],
    duration: "10 weeks",
    progress: 5
  },
  { 
    name: "Economics", 
    image: "https://i.pinimg.com/736x/a3/1f/c3/a31fc313ee657b32e61c2a2ced6ae8c7.jpg",
    description: "Foundations of micro and macro economics in the African context.",
    modules: [
      { title: "Module 1: Basic Principles", lessons: ["Scarcity and Choice", "Supply and Demand", "Elasticity"] }
    ],
    duration: "8 weeks",
    progress: 0
  },
  { 
    name: "History", 
    image: "https://i.pinimg.com/736x/64/90/26/6490267b7713701bdf29ad429987f0d6.jpg",
    description: "Dive into the rich history of Cameroon and the world.",
    modules: [
      { title: "Module 1: Pre-Colonial Cameroon", lessons: ["The Coastal Peoples", "The Grassfields Societies", "The Northern Kingdoms"] }
    ],
    duration: "8 weeks" ,
    progress: 0
  },
  { 
    name: "Geography", 
    image: "https://i.pinimg.com/1200x/f5/67/6f/f5676fe4a3d124659809ae873024ea44.jpg",
    description: "Physical and human geography of the world and Cameroon.",
    modules: [
      { title: "Module 1: Physical Geography", lessons: ["Climate and Weather", "Geomorphology", "Hydrology"] }
    ],
    duration: "8 weeks",
    progress: 0
  },
  { 
    name: "Literature in English", 
    image: "https://i.pinimg.com/736x/27/b2/4a/27b24a2124d324d755361101dc38c70a.jpg",
    description: "Analysis of African and international literary works.",
    modules: [
      { title: "Module 1: Poetry", lessons: ["Literary Devices", "Selected Poems Analysis"] },
      { title: "Module 2: Prose", lessons: ["Classic Novels", "African Literature"] }
    ],
    duration: "9 weeks",
    progress: 0
  }
];

export const COMMUNITIES = [
  { id: 1, name: "GCE A-Level Sciences", members: 1240, icon: "atom" },
  { id: 2, name: "Form Five Mathematics", members: 890, icon: "ruler" },
  { id: 3, name: "Baccalauréat Physics", members: 560, icon: "zap" },
  { id: 4, name: "University Prep - UB/UST", members: 2100, icon: "graduation-cap" }
];
