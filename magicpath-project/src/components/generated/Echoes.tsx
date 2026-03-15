import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Mic, Share2, Download, SkipBack, SkipForward, Volume2, Home, Library, Settings, Sparkles, ChevronLeft, Film, Clock, MessageCircle, Globe, Layers, Send, Zap, MapPin, Heart, Clapperboard, Plus, Radio, Headphones, Wand2, Eye, ChevronRight, RefreshCw, Check, X, ArrowRight, Wind, Shuffle, Repeat, Search, Filter, Users, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewType = 'landing' | 'generating' | 'player' | 'library' | 'map' | 'talk';
type SongVariant = 'hopeful' | 'sad' | 'cinematic';
type PlayerTab = 'lyrics' | 'video' | 'band' | 'timeline';
interface VideoScene {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  startPercent: number;
  mood: string;
}
interface VariantSong {
  variant: SongVariant;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  genre: string;
  tempo: string;
  verse: string;
  chorus: string;
  bridge: string;
}
interface BandMember {
  instrument: string;
  symbol: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emotion: string;
  active: boolean;
  bpm: number;
}
interface EchoSong {
  id: string;
  title: string;
  memory: string;
  emotion: string;
  genre: string;
  verse: string;
  chorus: string;
  bridge: string;
  coverUrl: string;
  date: string;
  duration: number;
  plays: number;
  scenes: VideoScene[];
  variants: VariantSong[];
  futureLyrics: {
    verse: string;
    chorus: string;
    bridge: string;
  };
  band: BandMember[];
  mapLocation: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  moodColor: string;
  accentColor: string;
}
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  emotion?: string;
  timestamp: string;
  musicUpdate?: string;
}
interface MapPin {
  city: string;
  country: string;
  memory: string;
  genre: string;
  dotColor: string;
  glowColor: string;
  x: number;
  y: number;
  plays: number;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const MAP_PINS: MapPin[] = [{
  city: 'Tokyo',
  country: 'JP',
  memory: 'Neon rain after heartbreak',
  genre: 'City Pop',
  dotColor: 'bg-pink-400',
  glowColor: 'shadow-pink-400/60',
  x: 76.2,
  y: 26,
  plays: 14320
}, {
  city: 'London',
  country: 'GB',
  memory: 'Last tube home with strangers',
  genre: 'Indie Rock',
  dotColor: 'bg-sky-400',
  glowColor: 'shadow-sky-400/60',
  x: 43.0,
  y: 16,
  plays: 9841
}, {
  city: 'Paris',
  country: 'FR',
  memory: 'Fall in love over coffee',
  genre: 'French Jazz',
  dotColor: 'bg-amber-400',
  glowColor: 'shadow-amber-400/60',
  x: 46.0,
  y: 19,
  plays: 11203
}, {
  city: 'New York',
  country: 'US',
  memory: 'Walking Central Park at dawn',
  genre: 'Neo Soul',
  dotColor: 'bg-violet-400',
  glowColor: 'shadow-violet-400/60',
  x: 23.5,
  y: 30,
  plays: 18920
}, {
  city: 'Lagos',
  country: 'NG',
  memory: 'First time hearing Afrobeats live',
  genre: 'Afrobeats',
  dotColor: 'bg-lime-400',
  glowColor: 'shadow-lime-400/60',
  x: 47.0,
  y: 52,
  plays: 7630
}, {
  city: 'São Paulo',
  country: 'BR',
  memory: 'Dancing in the rain after finals',
  genre: 'Bossa Nova',
  dotColor: 'bg-teal-400',
  glowColor: 'shadow-teal-400/60',
  x: 27.5,
  y: 70,
  plays: 6210
}, {
  city: 'Seoul',
  country: 'KR',
  memory: 'Han River at midnight alone',
  genre: 'K-Indie',
  dotColor: 'bg-rose-400',
  glowColor: 'shadow-rose-400/60',
  x: 74.2,
  y: 24,
  plays: 12750
}, {
  city: 'Sydney',
  country: 'AU',
  memory: 'Opera House at sunrise, alone',
  genre: 'Dream Pop',
  dotColor: 'bg-cyan-400',
  glowColor: 'shadow-cyan-400/60',
  x: 80.5,
  y: 70,
  plays: 5490
}, {
  city: 'Berlin',
  country: 'DE',
  memory: 'Last night before the wall fell',
  genre: 'Techno',
  dotColor: 'bg-orange-400',
  glowColor: 'shadow-orange-400/60',
  x: 49.5,
  y: 15,
  plays: 8300
}, {
  city: 'Mumbai',
  country: 'IN',
  memory: 'Monsoon on the rooftop',
  genre: 'Bollywood Indie',
  dotColor: 'bg-yellow-400',
  glowColor: 'shadow-yellow-400/60',
  x: 63.5,
  y: 44,
  plays: 15600
}];
const GENERATE_STEPS: {
  label: string;
  sub: string;
  duration: number;
  color: string;
}[] = [{
  label: 'Extracting emotional core',
  sub: 'Analyzing memory depth & sentiment...',
  duration: 900,
  color: 'bg-pink-500'
}, {
  label: 'Composing lyrical structure',
  sub: 'Verse, chorus, bridge generation...',
  duration: 1100,
  color: 'bg-violet-500'
}, {
  label: 'Synthesizing instrumentation',
  sub: 'Selecting instruments to match emotion...',
  duration: 950,
  color: 'bg-amber-500'
}, {
  label: 'Generating music video scenes',
  sub: 'Creating 4–6 cinematic frames...',
  duration: 800,
  color: 'bg-sky-500'
}, {
  label: 'Creating alternate timelines',
  sub: 'Hopeful · Sad · Cinematic versions...',
  duration: 700,
  color: 'bg-lime-500'
}, {
  label: 'Rendering album art',
  sub: 'AI painting your memory visual...',
  duration: 600,
  color: 'bg-orange-500'
}, {
  label: 'Writing future memory',
  sub: '10-years-later perspective...',
  duration: 500,
  color: 'bg-teal-500'
}];
const INITIAL_SONGS: EchoSong[] = [{
  id: '1',
  title: 'Midnight Roads',
  memory: 'Late night drive after graduation, windows down, radio loud',
  emotion: 'nostalgic',
  genre: 'Indie Pop',
  verse: 'Streetlights flicker on the empty road\nRadio playing songs we used to know\nThe city shrinks behind the rearview glass\nA version of ourselves that couldn\'t last',
  chorus: 'These nights will never fade\nEven when we\'re miles away\nWe were golden, we were young\nEvery word left still unsung',
  bridge: 'And I drive to feel it one more time\nThe night we had the whole world feeling fine',
  coverUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
  date: '2024-03-10',
  duration: 214,
  plays: 4821,
  moodColor: 'from-violet-500 to-indigo-600',
  accentColor: '#8b5cf6',
  tags: ['night', 'drive', 'graduation', 'freedom'],
  scenes: [{
    id: 's1',
    label: 'The Drive',
    description: 'Neon city highway at 2am, motion blur',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    startPercent: 0,
    mood: 'electric'
  }, {
    id: 's2',
    label: 'Rain on Glass',
    description: 'Raindrops tracing paths across the window',
    imageUrl: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?auto=format&fit=crop&q=80&w=800',
    startPercent: 25,
    mood: 'reflective'
  }, {
    id: 's3',
    label: 'Empty Streets',
    description: 'Deserted boulevard, lone sodium lamp',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800',
    startPercent: 55,
    mood: 'lonely'
  }, {
    id: 's4',
    label: 'Sunrise Ending',
    description: 'Golden horizon breaking through the windshield',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    startPercent: 82,
    mood: 'hopeful'
  }],
  variants: [{
    variant: 'hopeful',
    label: 'Hopeful',
    icon: '✨',
    color: 'from-amber-400 to-yellow-300',
    bgColor: 'bg-amber-400/15 border-amber-400/40',
    genre: 'Uplifting Indie',
    tempo: '128 BPM',
    verse: 'Every road is a new beginning\nHeadlights cutting through the unknown\nWe carry joy in our breathing\nAnd make this highway our home',
    chorus: 'We are headed somewhere bright\nThrough the dark and into light\nAll the miles become our story\nRising into morning glory',
    bridge: 'Forward, always forward, that\'s the only way to go'
  }, {
    variant: 'sad',
    label: 'Melancholic',
    icon: '🌧',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/15 border-blue-500/40',
    genre: 'Melancholic Folk',
    tempo: '72 BPM',
    verse: 'The rearview holds everyone\nI\'ve ever had to leave behind\nThe radio plays the same old song\nFor a heart that can\'t unwind',
    chorus: 'Some goodbyes last forever\nSome roads have no return\nI keep the windows open\nFor a warmth I\'ll never learn',
    bridge: 'And the city lights grow smaller\nLike the ones I used to know'
  }, {
    variant: 'cinematic',
    label: 'Cinematic',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/15 border-purple-500/40',
    genre: 'Orchestral Pop',
    tempo: '96 BPM',
    verse: 'Streetlights flicker on the empty road\nRadio playing songs we used to know\nThe city shrinks behind the rearview glass\nA version of ourselves that couldn\'t last',
    chorus: 'These nights will never fade\nEven when we\'re miles away\nWe were golden, we were young\nEvery word left still unsung',
    bridge: 'And I drive to feel it one more time\nThe night we had the whole world feeling fine'
  }],
  futureLyrics: {
    verse: 'I still drive that highway in my dreams\nDecades older now, and yet it seems\nThe same old radio plays the same old song\nAnd I wonder where the years have gone',
    chorus: 'I would give anything to feel\nThat one night as pure and real\nWhen the whole wide world was waiting\nAnd my heart was never breaking',
    bridge: 'My kids ask why I smile on that old road\nI just say some nights carry more than gold'
  },
  band: [{
    instrument: 'Guitar',
    symbol: '🎸',
    color: 'text-amber-300',
    bgColor: 'bg-amber-400/15',
    borderColor: 'border-amber-400/40',
    emotion: 'freedom',
    active: true,
    bpm: 96
  }, {
    instrument: 'Drums',
    symbol: '🥁',
    color: 'text-red-300',
    bgColor: 'bg-red-400/15',
    borderColor: 'border-red-400/40',
    emotion: 'heartbeat',
    active: true,
    bpm: 96
  }, {
    instrument: 'Piano',
    symbol: '🎹',
    color: 'text-sky-300',
    bgColor: 'bg-sky-400/15',
    borderColor: 'border-sky-400/40',
    emotion: 'nostalgia',
    active: true,
    bpm: 96
  }, {
    instrument: 'Bass',
    symbol: '🎵',
    color: 'text-violet-300',
    bgColor: 'bg-violet-400/15',
    borderColor: 'border-violet-400/40',
    emotion: 'longing',
    active: false,
    bpm: 96
  }],
  mapLocation: {
    city: 'Los Angeles',
    country: 'US',
    lat: 34.05,
    lng: -118.25
  }
}, {
  id: '2',
  title: 'Sunset Goodbye',
  memory: 'Watching the last sunset together at Malibu beach, not knowing it was goodbye',
  emotion: 'bittersweet',
  genre: 'Cinematic Folk',
  verse: 'The golden hour turns to gray\nWords we never found the heart to say\nThe tide comes in to wash the shore\nAnd quietly you walked through my door',
  chorus: 'Wait for the light to disappear\nI wish you were still standing here\nIn the amber of the dying day\nI gave all I had and couldn\'t stay',
  bridge: 'There are sunsets I collect like photographs\nBut none of them remember what we had',
  coverUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800',
  date: '2024-03-08',
  duration: 198,
  plays: 3240,
  moodColor: 'from-orange-500 to-rose-500',
  accentColor: '#f97316',
  tags: ['sunset', 'goodbye', 'beach', 'love'],
  scenes: [{
    id: 's5',
    label: 'Golden Shore',
    description: 'Beach at golden hour, two silhouettes',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    startPercent: 0,
    mood: 'golden'
  }, {
    id: 's6',
    label: 'The Last Light',
    description: 'Sun dipping below horizon, warm glow',
    imageUrl: 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?auto=format&fit=crop&q=80&w=800',
    startPercent: 35,
    mood: 'fading'
  }, {
    id: 's7',
    label: 'Dusk Falls',
    description: 'Purple sky, quiet waves, footprints in sand',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&q=80&w=800',
    startPercent: 70,
    mood: 'melancholy'
  }],
  variants: [{
    variant: 'hopeful',
    label: 'Hopeful',
    icon: '✨',
    color: 'from-amber-400 to-yellow-300',
    bgColor: 'bg-amber-400/15 border-amber-400/40',
    genre: 'Dreamy Pop',
    tempo: '110 BPM',
    verse: 'The sun will rise on a new tomorrow\nAnd love finds those who dare to wait\nEvery shore holds a new beginning\nEvery tide washes clean the slate',
    chorus: 'Every ending holds a sunrise\nEvery goodbye finds its way back\nThe horizon is not a wall\nIt\'s the door to everything',
    bridge: 'What we had was just the opening act'
  }, {
    variant: 'sad',
    label: 'Melancholic',
    icon: '🌧',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/15 border-blue-500/40',
    genre: 'Acoustic Ballad',
    tempo: '60 BPM',
    verse: 'The golden hour turns to gray\nWords we never found the heart to say\nThe tide comes in to wash the shore\nAnd quietly you walked through my door',
    chorus: 'Wait for the light to disappear\nI wish you were still standing here\nIn the amber of the dying day\nI gave all I had and couldn\'t stay',
    bridge: 'There are sunsets I collect like photographs'
  }, {
    variant: 'cinematic',
    label: 'Cinematic',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/15 border-purple-500/40',
    genre: 'Epic Orchestral',
    tempo: '84 BPM',
    verse: 'A thousand sunsets couldn\'t hold\nThe story that our eyes once told\nThe orchestra of dusk and sea\nThe last movement, just you and me',
    chorus: 'In the dying of the light\nYour face became my whole sky\nThe world fell silent, just for then\nAnd time refused to start again',
    bridge: 'That horizon holds your silhouette'
  }],
  futureLyrics: {
    verse: 'I\'ve watched a thousand sunsets since\nAnd none have held the same significance\nMy children love the beach in July\nThey don\'t know why I always cry',
    chorus: 'Still chasing that horizon where\nYou turned and smiled and stood right there\nThe world was young, the air was gold\nAnd we had stories left untold',
    bridge: 'Some goodbyes last longer than the life they left behind'
  },
  band: [{
    instrument: 'Guitar',
    symbol: '🎸',
    color: 'text-amber-300',
    bgColor: 'bg-amber-400/15',
    borderColor: 'border-amber-400/40',
    emotion: 'warmth',
    active: true,
    bpm: 84
  }, {
    instrument: 'Drums',
    symbol: '🥁',
    color: 'text-red-300',
    bgColor: 'bg-red-400/15',
    borderColor: 'border-red-400/40',
    emotion: 'pulse',
    active: false,
    bpm: 84
  }, {
    instrument: 'Piano',
    symbol: '🎹',
    color: 'text-sky-300',
    bgColor: 'bg-sky-400/15',
    borderColor: 'border-sky-400/40',
    emotion: 'grief',
    active: true,
    bpm: 84
  }, {
    instrument: 'Strings',
    symbol: '🎻',
    color: 'text-rose-300',
    bgColor: 'bg-rose-400/15',
    borderColor: 'border-rose-400/40',
    emotion: 'longing',
    active: true,
    bpm: 84
  }],
  mapLocation: {
    city: 'Malibu',
    country: 'US',
    lat: 34.03,
    lng: -118.78
  }
}, {
  id: '3',
  title: 'First Flight Home',
  memory: 'Flying back home after five years living abroad, looking down at the city lights',
  emotion: 'overwhelmed',
  genre: 'Ambient Folk',
  verse: 'Five years packed into a carry-on\nThe skyline I grew up on pulls me along\nCity lights like scattered prayers below\nAll the people that I used to know',
  chorus: 'Coming home feels strange now\nEverything the same, but me\nI left a kid and now I\'m landing\nA stranger who speaks fluently',
  bridge: 'The seat belt sign turns off above the clouds\nAnd I remember who I was before the crowd',
  coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
  date: '2024-02-20',
  duration: 231,
  plays: 2190,
  moodColor: 'from-sky-400 to-blue-600',
  accentColor: '#38bdf8',
  tags: ['homecoming', 'journey', 'growth', 'reflection'],
  scenes: [{
    id: 's8',
    label: 'Above the Clouds',
    description: 'Plane window, golden clouds, infinite blue',
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-98f45c47344b?auto=format&fit=crop&q=80&w=800',
    startPercent: 0,
    mood: 'awe'
  }, {
    id: 's9',
    label: 'City Grid Below',
    description: 'Night city lights from 30,000 feet',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800',
    startPercent: 30,
    mood: 'nostalgic'
  }, {
    id: 's10',
    label: 'The Landing',
    description: 'Runway lights approaching through the rain',
    imageUrl: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&q=80&w=800',
    startPercent: 60,
    mood: 'anxious'
  }, {
    id: 's11',
    label: 'Terminal Gate',
    description: 'Familiar faces through the glass',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    startPercent: 85,
    mood: 'emotional'
  }],
  variants: [{
    variant: 'hopeful',
    label: 'Hopeful',
    icon: '✨',
    color: 'from-amber-400 to-yellow-300',
    bgColor: 'bg-amber-400/15 border-amber-400/40',
    genre: 'Indie Folk',
    tempo: '118 BPM',
    verse: 'The runway stretches out like promise\nA new chapter just begun\nEverything that I\'ve been through\nHas made me who I\'ve become',
    chorus: 'Home is not the place I left\nHome is who I am right now\nI carry every road I\'ve traveled\nIn the lines across my brow',
    bridge: 'And the city says welcome back, you\'ve grown'
  }, {
    variant: 'sad',
    label: 'Melancholic',
    icon: '🌧',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/15 border-blue-500/40',
    genre: 'Sad Indie',
    tempo: '68 BPM',
    verse: 'Five years packed into a carry-on\nThe skyline I grew up on pulls me along\nCity lights like scattered prayers below\nAll the people that I used to know',
    chorus: 'Coming home feels strange now\nEverything the same, but me\nI left a kid and now I\'m landing\nA stranger who speaks fluently',
    bridge: 'I don\'t know how to be the person they remember'
  }, {
    variant: 'cinematic',
    label: 'Cinematic',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/15 border-purple-500/40',
    genre: 'Orchestral',
    tempo: '88 BPM',
    verse: 'Ten thousand feet above the life I knew\nA symphony of everything I\'ve been through\nThe orchestra below me hums its lights\nA homecoming scored in midnight rights',
    chorus: 'The whole world held its breath for me to land\nA story told in suitcases and sand\nI opened up the chapter, turned the page\nAnd stepped out of my very private cage',
    bridge: 'The runway was the finest stage of all'
  }],
  futureLyrics: {
    verse: 'My daughter asks me what it\'s like to fly\nI tell her every landing makes you cry\nNot out of sadness — out of recognition\nThat every journey ends in a decision',
    chorus: 'To stay or go, to hold or let things fade\nTo count the miles or treasure what you\'ve made\nI chose to stay and watch the city grow\nAnd raise a kid in the only town I know',
    bridge: 'The clouds still call but roots run deep as rain'
  },
  band: [{
    instrument: 'Guitar',
    symbol: '🎸',
    color: 'text-amber-300',
    bgColor: 'bg-amber-400/15',
    borderColor: 'border-amber-400/40',
    emotion: 'wandering',
    active: true,
    bpm: 88
  }, {
    instrument: 'Drums',
    symbol: '🥁',
    color: 'text-red-300',
    bgColor: 'bg-red-400/15',
    borderColor: 'border-red-400/40',
    emotion: 'momentum',
    active: true,
    bpm: 88
  }, {
    instrument: 'Piano',
    symbol: '🎹',
    color: 'text-sky-300',
    bgColor: 'bg-sky-400/15',
    borderColor: 'border-sky-400/40',
    emotion: 'homecoming',
    active: true,
    bpm: 88
  }, {
    instrument: 'Synth',
    symbol: '🎛',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-400/15',
    borderColor: 'border-cyan-400/40',
    emotion: 'distance',
    active: false,
    bpm: 88
  }],
  mapLocation: {
    city: 'New York',
    country: 'US',
    lat: 40.71,
    lng: -74.00
  }
}];
const NEW_SONG_TEMPLATE: Omit<EchoSong, 'id' | 'title' | 'memory' | 'date'> = {
  emotion: 'nostalgic',
  genre: 'Ambient Dream Pop',
  verse: 'Echoes of a time we used to know\nA feeling only memory can show\nSoft and bright like photographs left out\nOf moments no one talks about',
  chorus: 'Captured in this melody forever\nTied to moments lost in the ether\nEvery note a door back to that place\nEvery chord the outline of your face',
  bridge: 'And the music knows what words cannot',
  coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a197c0c1?auto=format&fit=crop&q=80&w=800',
  duration: 203,
  plays: 0,
  moodColor: 'from-fuchsia-500 to-purple-600',
  accentColor: '#d946ef',
  tags: ['memory', 'ambient', 'reflection'],
  scenes: [{
    id: 'n1',
    label: 'The Moment',
    description: 'The scene as it was, exact and fragile',
    imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800',
    startPercent: 0,
    mood: 'present'
  }, {
    id: 'n2',
    label: 'The Feeling',
    description: 'Emotion made visual, light through fog',
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800',
    startPercent: 28,
    mood: 'ethereal'
  }, {
    id: 'n3',
    label: 'The Echo',
    description: 'Memory fading into diffused light',
    imageUrl: 'https://images.unsplash.com/photo-1550684376-efdf6a36d673?auto=format&fit=crop&q=80&w=800',
    startPercent: 60,
    mood: 'fading'
  }, {
    id: 'n4',
    label: 'The Horizon',
    description: 'Looking forward from the memory',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    startPercent: 84,
    mood: 'forward'
  }],
  variants: [{
    variant: 'hopeful',
    label: 'Hopeful',
    icon: '✨',
    color: 'from-amber-400 to-yellow-300',
    bgColor: 'bg-amber-400/15 border-amber-400/40',
    genre: 'Uplifting Indie',
    tempo: '120 BPM',
    verse: 'Every scar becomes a story\nEvery loss becomes a door\nWhat we thought was grief was glory\nWe are more than what came before',
    chorus: 'We are more than what we\'ve lost\nWe are everything we\'ve crossed\nEvery bridge we burned was kindling\nFor the fire we\'re still building',
    bridge: 'The best of us is still ahead'
  }, {
    variant: 'sad',
    label: 'Melancholic',
    icon: '🌧',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/15 border-blue-500/40',
    genre: 'Melancholic Folk',
    tempo: '64 BPM',
    verse: 'Some things stay gone forever\nNo matter how hard the heart holds on\nWe reach into the quiet spaces\nFor the warmth that\'s long since gone',
    chorus: 'I\'m still there in that moment\nEven as the moment\'s gone\nThe echo carries everything\nThe melody goes on and on',
    bridge: 'And I don\'t know how to say goodbye to yesterday'
  }, {
    variant: 'cinematic',
    label: 'Cinematic',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/15 border-purple-500/40',
    genre: 'Orchestral Pop',
    tempo: '92 BPM',
    verse: 'Echoes of a time we used to know\nA feeling only memory can show\nSoft and bright like photographs left out\nOf moments no one talks about',
    chorus: 'Captured in this melody forever\nTied to moments lost in the ether\nEvery note a door back to that place\nEvery chord the outline of your face',
    bridge: 'And the music knows what words cannot'
  }],
  futureLyrics: {
    verse: 'I look back now across the years\nAnd see it clearly through the tears\nWhat I thought was loss was shaping me\nInto everything I\'m free to be',
    chorus: 'That moment made me who I am\nI finally understand\nEvery echo was a lesson\nEvery memory, a blessing',
    bridge: 'I wouldn\'t change a single note of it'
  },
  band: [{
    instrument: 'Guitar',
    symbol: '🎸',
    color: 'text-amber-300',
    bgColor: 'bg-amber-400/15',
    borderColor: 'border-amber-400/40',
    emotion: 'longing',
    active: true,
    bpm: 92
  }, {
    instrument: 'Drums',
    symbol: '🥁',
    color: 'text-red-300',
    bgColor: 'bg-red-400/15',
    borderColor: 'border-red-400/40',
    emotion: 'heartbeat',
    active: true,
    bpm: 92
  }, {
    instrument: 'Piano',
    symbol: '🎹',
    color: 'text-sky-300',
    bgColor: 'bg-sky-400/15',
    borderColor: 'border-sky-400/40',
    emotion: 'memory',
    active: true,
    bpm: 92
  }, {
    instrument: 'Bass',
    symbol: '🎵',
    color: 'text-violet-300',
    bgColor: 'bg-violet-400/15',
    borderColor: 'border-violet-400/40',
    emotion: 'depth',
    active: false,
    bpm: 92
  }],
  mapLocation: {
    city: 'Your City',
    country: '',
    lat: 0,
    lng: 0
  }
};
const FEATURE_CARDS = [{
  icon: Film,
  label: 'Cinematic Video',
  desc: '4–6 AI scenes synced to the beat',
  gradient: 'from-violet-500/25 to-purple-600/15',
  border: 'border-violet-400/30',
  iconColor: 'text-violet-300',
  badge: 'bg-violet-500/20 text-violet-300 border-violet-400/30'
}, {
  icon: Layers,
  label: 'Alt Timelines',
  desc: 'Hopeful · Sad · Cinematic',
  gradient: 'from-pink-500/25 to-rose-600/15',
  border: 'border-pink-400/30',
  iconColor: 'text-pink-300',
  badge: 'bg-pink-500/20 text-pink-300 border-pink-400/30'
}, {
  icon: Clock,
  label: 'Future Memory',
  desc: 'How it sounds 10 years later',
  gradient: 'from-teal-500/25 to-cyan-600/15',
  border: 'border-teal-400/30',
  iconColor: 'text-teal-300',
  badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30'
}, {
  icon: Globe,
  label: 'Global Map',
  desc: 'A world archive of moments',
  gradient: 'from-sky-500/25 to-blue-600/15',
  border: 'border-sky-400/30',
  iconColor: 'text-sky-300',
  badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30'
}, {
  icon: Radio,
  label: 'AI Band Studio',
  desc: 'Toggle instruments live',
  gradient: 'from-amber-500/25 to-orange-600/15',
  border: 'border-amber-400/30',
  iconColor: 'text-amber-300',
  badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
}, {
  icon: MessageCircle,
  label: 'Memory Therapy',
  desc: 'Talk to AI — music evolves',
  gradient: 'from-fuchsia-500/25 to-purple-600/15',
  border: 'border-fuchsia-400/30',
  iconColor: 'text-fuchsia-300',
  badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30'
}];
const QUICK_PROMPTS = ['Late night drive after graduation', 'Moving to a new city alone', 'First concert that changed everything', 'Last summer before everything changed', 'The morning I left home forever', 'Driving through Tokyo after my breakup'];
const AI_CHAT_RESPONSES = [{
  text: 'That\'s a powerful detail. I\'m shifting the chord progression to feel heavier — your memory carries real weight.',
  emotion: 'processing',
  musicUpdate: 'Minor key detected · Adding reverb'
}, {
  text: 'I can feel the longing in what you\'re describing. Slowing the tempo down, adding more space between the notes.',
  emotion: 'empathetic',
  musicUpdate: 'Tempo: 96→72 BPM · +Reverb tail'
}, {
  text: 'Interesting — that changes the whole emotional arc. I\'m rewriting the bridge to capture that contradiction.',
  emotion: 'curious',
  musicUpdate: 'Bridge rewritten · Key shift: Am→Em'
}, {
  text: 'The regret in that detail is intense. I\'ve added cello layers under the chorus. It should feel heavier now.',
  emotion: 'adapting',
  musicUpdate: '+Cello · Dynamics shifted down'
}, {
  text: 'That detail makes everything feel more specific. Songs that name real things hit harder — updating the verse.',
  emotion: 'inspired',
  musicUpdate: 'Verse lyrics updated · +Specificity'
}];
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ─── Flow Banner ───────────────────────────────────────────────────────────────

const FLOW_BANNERS: Record<string, {
  icon: string;
  text: string;
  next: string;
  nextView: ViewType;
  color: string;
}> = {
  landing: {
    icon: '✍️',
    text: 'Type a memory below to begin your journey',
    next: 'Browse your songs →',
    nextView: 'library',
    color: 'from-violet-500/20 to-fuchsia-500/10 border-violet-400/25'
  },
  generating: {
    icon: '🎼',
    text: 'Your memory is being woven into a song...',
    next: 'Almost there!',
    nextView: 'player',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-400/25'
  },
  player: {
    icon: '🎧',
    text: 'Now playing your memory',
    next: 'See all songs →',
    nextView: 'library',
    color: 'from-pink-500/20 to-rose-500/10 border-pink-400/25'
  },
  library: {
    icon: '📦',
    text: 'Your memory archive — click any song to play',
    next: 'Explore the world map →',
    nextView: 'map',
    color: 'from-sky-500/20 to-blue-500/10 border-sky-400/25'
  },
  map: {
    icon: '🌍',
    text: 'Memories echoing across the globe',
    next: 'Try Talk Mode →',
    nextView: 'talk',
    color: 'from-lime-500/20 to-teal-500/10 border-lime-400/25'
  },
  talk: {
    icon: '🗣️',
    text: 'Tell the AI about your memory — the music will evolve',
    next: 'Back to Home →',
    nextView: 'landing',
    color: 'from-fuchsia-500/20 to-purple-500/10 border-fuchsia-400/25'
  }
};

// ─── WaveformBars ─────────────────────────────────────────────────────────────

const WAVEFORM_SEED = Array.from({
  length: 48
}, (_, i) => ({
  id: i,
  height: Math.sin(i * 0.4) * 20 + Math.cos(i * 0.7) * 15 + 30,
  delay: i * 0.04 % 0.6,
  dur: 0.7 + i % 5 * 0.12
}));
const WaveformBars = ({
  isPlaying,
  count = 32,
  compact = false,
  colorClass = 'from-fuchsia-500 to-violet-400'
}: {
  isPlaying: boolean;
  count?: number;
  compact?: boolean;
  colorClass?: string;
}) => {
  const bars = WAVEFORM_SEED.slice(0, count);
  return <div className={cn('flex items-end gap-[2px]', compact ? 'h-6' : 'h-10')}>
      {bars.map(bar => <motion.div key={bar.id} className={cn('w-[3px] bg-gradient-to-t rounded-full', colorClass)} animate={isPlaying ? {
      height: [bar.height * 0.3, bar.height, bar.height * 0.5, bar.height * 0.85, bar.height * 0.3]
    } : {
      height: compact ? 3 : 4
    }} transition={{
      duration: bar.dur,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: bar.delay
    }} style={{
      height: compact ? 3 : 4
    }} />)}
    </div>;
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const Echoes = () => {
  const [isDark, setIsDark] = useState(true);
  const [view, setView] = useState<ViewType>('landing');
  const [memoryInput, setMemoryInput] = useState('');
  const [library, setLibrary] = useState<EchoSong[]>(INITIAL_SONGS);
  const [activeSong, setActiveSong] = useState<EchoSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [isRecording, setIsRecording] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [activeVariant, setActiveVariant] = useState<SongVariant>('cinematic');
  const [showVideoMode, setShowVideoMode] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [activeTab, setActiveTab] = useState<PlayerTab>('lyrics');
  const [bandState, setBandState] = useState<BandMember[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{
    id: 'init',
    role: 'ai',
    text: 'Tell me more about this memory. What detail stands out the most — a sound, a smell, a face?',
    emotion: 'curious',
    timestamp: '12:00'
  }]);
  const [chatInput, setChatInput] = useState('');
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const [heartedSongs, setHeartedSongs] = useState<Set<string>>(new Set());
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 100 / ((activeSong?.duration ?? 200) * 10);
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSong]);
  useEffect(() => {
    if (activeSong) setBandState(activeSong.band);
  }, [activeSong]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chatMessages]);
  useEffect(() => {
    if (view !== 'generating') return;
    setGenStep(0);
    let step = 0;
    const advance = () => {
      step += 1;
      if (step < GENERATE_STEPS.length) {
        setGenStep(step);
        setTimeout(advance, GENERATE_STEPS[step].duration + 300);
      }
    };
    setTimeout(advance, GENERATE_STEPS[0].duration + 300);
  }, [view]);
  const handleCreate = useCallback(() => {
    if (!memoryInput.trim()) return;
    setView('generating');
    const totalTime = GENERATE_STEPS.reduce((a, s) => a + s.duration + 300, 0) + 400;
    setTimeout(() => {
      const words = memoryInput.trim().split(' ');
      const title = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const newSong: EchoSong = {
        ...NEW_SONG_TEMPLATE,
        id: `gen-${Date.now()}`,
        title,
        memory: memoryInput,
        date: new Date().toISOString().split('T')[0]
      };
      setLibrary(prev => [newSong, ...prev]);
      setActiveSong(newSong);
      setActiveVariant('cinematic');
      setActiveTab('lyrics');
      setShowVideoMode(false);
      setShowFuture(false);
      setProgress(0);
      setView('player');
      setIsPlaying(true);
    }, totalTime);
  }, [memoryInput]);
  const playSong = useCallback((song: EchoSong) => {
    setActiveSong(song);
    setActiveVariant('cinematic');
    setActiveTab('lyrics');
    setShowVideoMode(false);
    setShowFuture(false);
    setProgress(0);
    setView('player');
    setIsPlaying(true);
  }, []);
  const toggleBandInstrument = (idx: number) => {
    setBandState(prev => prev.map((b, i) => i === idx ? {
      ...b,
      active: !b.active
    } : b));
  };
  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const resp = AI_CHAT_RESPONSES[Math.floor(Math.random() * AI_CHAT_RESPONSES.length)];
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      text: resp.text,
      emotion: resp.emotion,
      musicUpdate: resp.musicUpdate,
      timestamp: new Date().toLocaleTimeString('en', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages(prev => [...prev, userMsg, aiMsg]);
    setChatInput('');
  }, [chatInput]);
  const currentVariant = activeSong?.variants.find(v => v.variant === activeVariant) ?? null;
  const currentLyrics = activeSong ? showFuture ? activeSong.futureLyrics : {
    verse: currentVariant?.verse ?? activeSong.verse,
    chorus: currentVariant?.chorus ?? activeSong.chorus,
    bridge: currentVariant?.bridge ?? activeSong.bridge
  } : null;
  const currentScene = activeSong ? activeSong.scenes.reduce((acc, scene) => progress * (activeSong.duration / 100) >= scene.startPercent / 100 * activeSong.duration ? scene : acc, activeSong.scenes[0]) : null;
  const filteredLibrary = library.filter(s => s.title.toLowerCase().includes(librarySearch.toLowerCase()) || s.memory.toLowerCase().includes(librarySearch.toLowerCase()));
  const NAV_ITEMS = [{
    id: 'landing' as ViewType,
    icon: Home,
    label: 'Home',
    color: 'text-violet-400',
    active: 'bg-violet-500/20 text-violet-200 border border-violet-500/30'
  }, {
    id: 'library' as ViewType,
    icon: Library,
    label: 'Library',
    color: 'text-sky-400',
    active: 'bg-sky-500/20 text-sky-200 border border-sky-500/30'
  }, {
    id: 'map' as ViewType,
    icon: Globe,
    label: 'World Map',
    color: 'text-lime-400',
    active: 'bg-lime-500/20 text-lime-200 border border-lime-500/30'
  }, {
    id: 'talk' as ViewType,
    icon: MessageCircle,
    label: 'Talk Mode',
    color: 'text-fuchsia-400',
    active: 'bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30'
  }];
  const flowBanner = FLOW_BANNERS[view];
  const tk = {
    bg: isDark ? 'bg-transparent' : 'bg-transparent',
    text: isDark ? 'text-white' : 'text-slate-900',
    sidebarBg: isDark ? 'bg-[#0a0618]/98' : 'bg-white/90',
    sidebarBorder: isDark ? 'border-white/[0.06]' : 'border-slate-200/80',
    card: isDark ? 'bg-white/[0.03]' : 'bg-white/70',
    cardBorder: isDark ? 'border-white/[0.06]' : 'border-slate-200',
    cardHover: isDark ? 'hover:border-fuchsia-400/30' : 'hover:border-fuchsia-400/60',
    surface: isDark ? 'bg-white/[0.03] border-white/[0.07]' : 'bg-slate-50 border-slate-200',
    input: isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-fuchsia-400/60' : 'bg-white/80 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-fuchsia-500',
    muted: isDark ? 'text-white/30' : 'text-slate-500',
    dimmed: isDark ? 'text-white/20' : 'text-slate-400',
    faint: isDark ? 'text-white/15' : 'text-slate-300',
    playerBg: isDark ? 'bg-[#0a0618]/97' : 'bg-white/95',
    playerBorder: isDark ? 'border-white/[0.07]' : 'border-slate-200',
    chatBg: isDark ? 'bg-[#07041a]' : 'bg-slate-50',
    chatBubbleAi: isDark ? 'bg-white/5 text-white/75 border-white/8' : 'bg-slate-100 text-slate-700 border-slate-200',
    chatBubbleUser: isDark ? 'bg-violet-500/20 text-violet-100 border-violet-400/30' : 'bg-violet-100 text-violet-900 border-violet-300',
    mapBg: isDark ? 'bg-[#04020b]' : 'bg-slate-800',
    sectionLabel: isDark ? 'text-white/25' : 'text-slate-400',
    navInactive: isDark ? 'opacity-60 hover:opacity-100 hover:bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-slate-100',
    tableRow: isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50',
    tableBorder: isDark ? 'border-white/[0.03]' : 'border-slate-100',
    modalBg: isDark ? 'bg-[#0e0820]' : 'bg-white',
    recentItem: isDark ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-slate-100 hover:border-slate-200',
    recentText: isDark ? 'text-white/30 group-hover:text-white/80' : 'text-slate-500 group-hover:text-slate-800',
    chip: isDark ? 'bg-white/5 border-white/8 text-white/40 hover:text-white hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-fuchsia-400/60 hover:bg-fuchsia-50',
    settingsBtn: isDark ? 'text-white/25 hover:bg-white/5 hover:text-white/60' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
  };
  return <div className={cn('min-h-screen w-full font-sans overflow-x-hidden', tk.text)}>

      {/* ═══ BACKGROUND IMAGE ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=85&w=2000" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        <div className="absolute inset-0 transition-opacity duration-500" style={{
        background: isDark ? 'linear-gradient(135deg, rgba(4,2,11,0.97) 0%, rgba(10,6,24,0.95) 50%, rgba(6,4,16,0.97) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.93) 0%, rgba(245,243,255,0.91) 50%, rgba(255,255,255,0.93) 100%)'
      }} />
        <div className="absolute inset-0 opacity-30 transition-opacity duration-500" style={{
        background: isDark ? 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(217,70,239,0.08) 0%, transparent 50%)' : 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(217,70,239,0.05) 0%, transparent 50%)'
      }} />
      </div>

      {/* ═══ SIDEBAR ═══ */}
      <nav className={cn('fixed left-0 top-0 bottom-0 w-[60px] md:w-56 border-r-2 z-50 flex flex-col items-center md:items-start py-5 px-2 md:px-4 backdrop-blur-2xl', tk.sidebarBg, tk.sidebarBorder)}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-7 cursor-pointer px-1" onClick={() => setView('landing')}>
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-900/50 flex-shrink-0 border-2 border-white/10">
            <Music className="w-4 h-4 text-white" />
          </div>
          <h1 className={cn('text-lg font-black tracking-tight hidden md:block', isDark ? 'bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent')}>
            Echoes
          </h1>
        </div>

        {/* Create Button */}
        <button onClick={() => {
        setMemoryInput('');
        setView('landing');
        inputRef.current?.focus();
      }} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-black text-xs mb-6 hover:from-violet-500 hover:to-pink-500 transition-all shadow-lg shadow-fuchsia-900/40 border-2 border-white/10">
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:block">New Memory</span>
        </button>

        {/* Nav Links */}
        <div className="space-y-1 w-full">
          {NAV_ITEMS.map(item => <button key={item.id} onClick={() => setView(item.id)} className={cn('flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all text-xs font-bold', view === item.id ? item.active : `${item.color} ${tk.navInactive}`)}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </button>)}
        </div>

        {/* Recent */}
        <div className="mt-6 w-full hidden md:block">
          <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-3 px-2', tk.sectionLabel)}>Recent</p>
          <div className="space-y-1">
            {library.slice(0, 4).map(song => <div key={song.id} className={cn('group cursor-pointer flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all border border-transparent', tk.recentItem)} onClick={() => playSong(song)}>
                <img src={song.coverUrl} className={cn('w-7 h-7 rounded-lg object-cover flex-shrink-0 opacity-60 group-hover:opacity-100 transition-all border', isDark ? 'border-white/8' : 'border-slate-200')} alt={song.title} />
                <span className={cn('text-[11px] truncate transition-colors font-semibold', tk.recentText)}>{song.title}</span>
              </div>)}
          </div>
        </div>

        {/* Bottom */}
        <div className={cn('mt-auto w-full pt-4 border-t', isDark ? 'border-white/[0.06]' : 'border-slate-200')}>
          <button onClick={() => setIsDark(p => !p)} className={cn('flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all text-xs font-bold mb-1', tk.settingsBtn)}>
            {isDark ? <Sun className="w-4 h-4 flex-shrink-0 text-amber-400" /> : <Moon className="w-4 h-4 flex-shrink-0 text-violet-500" />}
            <span className="hidden md:block">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className={cn('flex items-center gap-3 w-full px-2 py-2.5 rounded-xl text-xs font-bold transition-all', tk.settingsBtn)}>
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:block">Settings</span>
          </button>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="relative z-10 pl-[60px] md:pl-56 pb-28 min-h-screen">
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════ LANDING ════════════════════════════════════ */}
          {view === 'landing' && <motion.section key="landing" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.97
        }} transition={{
          duration: 0.35
        }} className="p-6 md:p-12 max-w-6xl mx-auto">

              {/* Flow Banner */}
              <motion.div initial={{
            opacity: 0,
            y: -8
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className={cn('flex items-center justify-between px-4 py-2.5 rounded-2xl border-2', flowBanner.color)}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{flowBanner.icon}</span>
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/70' : 'text-slate-600')}>{flowBanner.text}</span>
                </div>
                <button onClick={() => setView(flowBanner.nextView)} className={cn('text-[10px] font-black flex items-center gap-1 transition-colors', isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
                  <span>{flowBanner.next}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

              {/* Hero */}
              <div className="pt-2 mb-14">
                <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-7', isDark ? 'bg-fuchsia-500/15 border-fuchsia-400/30' : 'bg-fuchsia-50 border-fuchsia-300')}>
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                  <span className={cn('text-[10px] font-black uppercase tracking-[0.18em]', isDark ? 'text-fuchsia-300' : 'text-fuchsia-600')}>AI · Memories · Music</span>
                </div>

                <h2 className="text-4xl md:text-[60px] font-black mb-5 leading-[1.02] tracking-tight">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>Turn your moments</span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent italic">into cinematic songs.</span>
                </h2>
                <p className={cn('text-[15px] max-w-xl mb-9 leading-relaxed', tk.muted)}>
                  Describe a memory. Echoes creates a full cinematic package — original song, music video, lyrics, album art — across multiple emotional timelines.
                </p>

                {/* Input */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-5">
                  <div className="relative flex-grow">
                    <input ref={inputRef} type="text" placeholder="e.g. Driving through Tokyo at night after my breakup..." value={memoryInput} onChange={e => setMemoryInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} className={cn('w-full h-14 border-2 rounded-2xl px-5 pr-14 focus:outline-none transition-all text-sm', tk.input)} />
                    <button onClick={() => setIsRecording(!isRecording)} className={cn('absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all', isRecording ? 'text-red-400 animate-pulse bg-red-500/15 border border-red-400/30' : isDark ? 'text-white/30 hover:text-fuchsia-300 hover:bg-fuchsia-500/10' : 'text-slate-400 hover:text-fuchsia-500 hover:bg-fuchsia-50')}>
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  <button onClick={handleCreate} disabled={!memoryInput.trim()} className="h-14 px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-fuchsia-900/40 text-sm flex-shrink-0 border-2 border-white/10">
                    <Sparkles className="w-4 h-4" />
                    <span>Create My Song</span>
                  </button>
                </div>

                {/* Quick examples */}
                <div className="flex flex-wrap gap-2">
                  <span className={cn('font-black uppercase tracking-widest text-[9px]', tk.dimmed)}>Try:</span>
                  {QUICK_PROMPTS.map(p => <button key={p} onClick={() => setMemoryInput(p)} className={cn('px-3 py-1.5 rounded-xl border-2 transition-all text-[11px] font-semibold', tk.chip)}>
                      {p}
                    </button>)}
                </div>
              </div>

              {/* Feature Grid */}
              <div className="mb-14">
                <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-5', tk.sectionLabel)}>What you get</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FEATURE_CARDS.map(f => <div key={f.label} className={cn('rounded-3xl p-5 border-2 transition-all hover:scale-[1.03] cursor-default group backdrop-blur-sm', f.gradient, f.border)}>
                      <div className={cn('w-9 h-9 rounded-2xl border-2 flex items-center justify-center mb-3 bg-white/5', f.badge)}>
                        <f.icon className={cn('w-4 h-4', f.iconColor)} />
                      </div>
                      <p className={cn('text-sm font-black mb-1', isDark ? 'text-white' : 'text-slate-900')}>{f.label}</p>
                      <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-white/35' : 'text-slate-500')}>{f.desc}</p>
                    </div>)}
                </div>
              </div>

              {/* Your Echoes grid */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <p className={cn('text-[9px] font-black uppercase tracking-[0.2em]', tk.sectionLabel)}>Your Echoes</p>
                  <button onClick={() => setView('library')} className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-600 text-xs font-bold transition-colors">
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {library.slice(0, 6).map(song => <motion.div key={song.id} whileHover={{
                y: -4,
                scale: 1.01
              }} className={cn('group rounded-3xl overflow-hidden border-2 transition-all cursor-pointer backdrop-blur-sm', tk.card, tk.cardBorder, tk.cardHover)} onClick={() => playSong(song)}>
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-55 group-hover:opacity-90" />
                        <div className={cn('absolute inset-0 bg-gradient-to-t to-transparent', isDark ? 'from-[#060410] via-[#060410]/20' : 'from-slate-900/60 via-slate-900/10')} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"><Play className="w-5 h-5 text-white fill-white" /></div>
                        </div>
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[9px] font-black text-sky-300 border border-sky-400/25">{song.scenes.length} scenes</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black border" style={{
                      background: `${song.accentColor}20`,
                      color: song.accentColor,
                      borderColor: `${song.accentColor}40`
                    }}>{song.emotion}</span>
                        </div>
                        <button onClick={e => {
                    e.stopPropagation();
                    setHeartedSongs(prev => {
                      const next = new Set(prev);
                      next.has(song.id) ? next.delete(song.id) : next.add(song.id);
                      return next;
                    });
                  }} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className={cn('w-3.5 h-3.5 transition-colors', heartedSongs.has(song.id) ? 'text-pink-400 fill-pink-400' : isDark ? 'text-white/20' : 'text-slate-300')} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-sm font-black text-white mb-0.5">{song.title}</h4>
                          <p className="text-[10px] text-white/40 line-clamp-1">{song.memory}</p>
                        </div>
                      </div>
                      <div className={cn('px-4 py-3 flex items-center justify-between border-t', isDark ? 'border-white/[0.05]' : 'border-slate-200/60')}>
                        <span className={cn('text-[9px] font-black uppercase tracking-widest', tk.dimmed)}>{song.genre}</span>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-[10px]', tk.faint)}>{song.plays.toLocaleString()} plays</span>
                          <div className="flex gap-0.5">{song.variants.map(v => <span key={v.variant} className="text-[11px]">{v.icon}</span>)}<span className="text-[11px]">⏳</span></div>
                        </div>
                      </div>
                    </motion.div>)}
                </div>
              </div>
            </motion.section>}

          {/* ════════════════════════════════════ GENERATING ════════════════════════════════════ */}
          {view === 'generating' && <motion.section key="generating" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="flex flex-col items-center justify-center min-h-screen p-8">

              {/* Flow label */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border-2 border-amber-400/30 mb-10">
                <span className="text-base">🎼</span>
                <span className="text-xs font-black text-amber-300">Step 2 of 3 — Generating your song</span>
                <ChevronRight className="w-3 h-3 text-amber-400/50" />
                <span className="text-[10px] text-amber-400/50 font-bold">Player next</span>
              </div>

              {/* Animated orb */}
              <div className="relative w-52 h-52 mb-12">
                {[0, 1, 2].map(i => <motion.div key={i} className="absolute rounded-full border-2 border-dashed" style={{
              inset: `${i * 20}px`,
              borderColor: ['rgba(217,70,239,0.35)', 'rgba(139,92,246,0.25)', 'rgba(236,72,153,0.18)'][i]
            }} animate={{
              rotate: i % 2 === 0 ? 360 : -360
            }} transition={{
              duration: [7, 5, 3][i],
              repeat: Infinity,
              ease: 'linear'
            }} />)}
                <motion.div className="absolute inset-0 rounded-full" animate={{
              opacity: [0.06, 0.22, 0.06]
            }} transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }} style={{
              background: 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, transparent 70%)'
            }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div className="w-28 h-28 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-fuchsia-900/60 border-4 border-white/10" animate={{
                scale: [1, 1.06, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}>
                    <Music className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
              </div>

              <div className="text-center mb-10">
                <h2 className={cn('text-3xl md:text-4xl font-black mb-3 tracking-tight', isDark ? 'bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent')}>Composing your memory</h2>
                <p className={cn('text-sm max-w-xl mx-auto leading-relaxed', tk.muted)}>Building a full cinematic package — song, music video, alternate timelines & more.</p>
              </div>

              {/* Steps */}
              <div className="w-84 max-w-sm space-y-3 mb-10">
                {GENERATE_STEPS.map((step, i) => <motion.div key={step.label} initial={{
              opacity: 0,
              x: -12
            }} animate={{
              opacity: i <= genStep ? 1 : 0.15,
              x: 0
            }} transition={{
              delay: i * 0.08,
              duration: 0.3
            }} className="flex items-center gap-3">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all', i < genStep ? `${step.color} border-transparent` : i === genStep ? 'border-fuchsia-400 bg-fuchsia-500/20' : 'border-white/10 bg-transparent')}>
                      {i < genStep ? <Check className="w-3 h-3 text-white" /> : i === genStep ? <motion.div className="w-2 h-2 rounded-full bg-fuchsia-400" animate={{
                  opacity: [1, 0.2, 1]
                }} transition={{
                  duration: 0.7,
                  repeat: Infinity
                }} /> : null}
                    </div>
                    <div className="flex-grow">
                      <p className={cn('text-sm font-bold', i <= genStep ? isDark ? 'text-white' : 'text-slate-800' : isDark ? 'text-white/20' : 'text-slate-300')}>{step.label}</p>
                      <p className={cn('text-[10px]', i <= genStep ? isDark ? 'text-white/40' : 'text-slate-500' : isDark ? 'text-white/10' : 'text-slate-300')}>{step.sub}</p>
                    </div>
                    {i <= genStep && <span className={cn('w-2 h-2 rounded-full flex-shrink-0', step.color)} />}
                  </motion.div>)}
              </div>

              {/* Progress bar */}
              <div className={cn('w-80 h-2 rounded-full overflow-hidden border', isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-slate-300')}>
                <motion.div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full" initial={{
              width: 0
            }} animate={{
              width: `${(genStep + 1) / GENERATE_STEPS.length * 100}%`
            }} transition={{
              duration: 0.5,
              ease: 'easeOut'
            }} />
              </div>
              <p className={cn('mt-3 text-[11px] font-bold', tk.dimmed)}>{Math.round((genStep + 1) / GENERATE_STEPS.length * 100)}% complete</p>
            </motion.section>}

          {/* ════════════════════════════════════ PLAYER ════════════════════════════════════ */}
          {view === 'player' && activeSong && <motion.section key="player" initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.3
        }} className="p-5 md:p-10 max-w-7xl mx-auto">

              {/* Flow Banner */}
              <motion.div initial={{
            opacity: 0,
            y: -8
          }} animate={{
            opacity: 1,
            y: 0
          }} className={cn('flex items-center justify-between px-4 py-2.5 rounded-2xl border-2', flowBanner.color)}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{flowBanner.icon}</span>
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/60' : 'text-slate-600')}>You wrote a memory →</span>
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/60' : 'text-slate-600')}>AI composed it →</span>
                  <span className="text-xs font-black text-pink-400">Now playing ✦</span>
                </div>
                <button onClick={() => setView(flowBanner.nextView)} className={cn('text-[10px] font-black flex items-center gap-1 transition-colors', isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
                  <span>{flowBanner.next}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

              <button onClick={() => setView('landing')} className={cn('mb-6 flex items-center gap-1.5 transition-colors group text-xs font-bold', isDark ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-slate-900')}>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Echoes</span>
              </button>

              <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">

                {/* ── LEFT ── */}
                <div className="space-y-5">
                  {/* Cover / Video */}
                  <div className={cn('relative rounded-3xl overflow-hidden shadow-2xl group', isDark ? 'ring-2 ring-white/[0.08] shadow-fuchsia-950/80' : 'ring-2 ring-slate-200 shadow-slate-200/50')}>
                    <AnimatePresence mode="wait">
                      {showVideoMode && currentScene ? <motion.div key={currentScene.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }} transition={{
                    duration: 0.7
                  }} className="aspect-video">
                          <img src={currentScene.imageUrl} alt={currentScene.label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-5 left-5 right-5">
                            <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[9px] font-black text-fuchsia-300 uppercase tracking-widest border border-fuchsia-400/20">{currentScene.mood}</span>
                            <p className="text-sm font-black text-white mt-1">{currentScene.label}</p>
                            <p className="text-xs text-white/50">{currentScene.description}</p>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-1.5">
                            {activeSong.scenes.map(sc => <button key={sc.id} onClick={() => setProgress(sc.startPercent)} className={cn('w-2 h-2 rounded-full transition-all', sc.id === currentScene.id ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/70')} />)}
                          </div>
                        </motion.div> : <motion.div key="cover" initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }} className="aspect-square relative">
                          <img src={activeSong.coverUrl} alt={activeSong.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          {isPlaying && <motion.div className="absolute inset-0" animate={{
                      opacity: [0, 0.2, 0]
                    }} transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }} style={{
                      background: `linear-gradient(135deg, ${activeSong.accentColor}40, rgba(217,70,239,0.25))`
                    }} />}
                        </motion.div>}
                    </AnimatePresence>
                    <button onClick={() => setShowVideoMode(!showVideoMode)} className={cn('absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border-2 border-white/15 text-[10px] font-black text-white hover:bg-black/90 transition-all')}>
                      {showVideoMode ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                      <span>{showVideoMode ? 'Album Art' : 'Music Video'}</span>
                    </button>
                  </div>

                  {/* Song info */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h2 className={cn('text-2xl font-black leading-tight truncate', isDark ? 'text-white' : 'text-slate-900')}>{activeSong.title}</h2>
                        <p className={cn('text-xs mt-1 italic line-clamp-2', tk.muted)}>"{activeSong.memory}"</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => setHeartedSongs(prev => {
                      const next = new Set(prev);
                      next.has(activeSong.id) ? next.delete(activeSong.id) : next.add(activeSong.id);
                      return next;
                    })} className={cn('p-2 rounded-xl transition-all border', isDark ? 'bg-white/5 hover:bg-pink-500/15 border-white/5 hover:border-pink-400/30' : 'bg-slate-100 hover:bg-pink-50 border-slate-200 hover:border-pink-300')}>
                          <Heart className={cn('w-4 h-4 transition-colors', heartedSongs.has(activeSong.id) ? 'text-pink-400 fill-pink-400' : isDark ? 'text-white/20' : 'text-slate-300')} />
                        </button>
                        <button onClick={() => setShowShareCard(true)} className={cn('p-2 rounded-xl transition-all border', isDark ? 'bg-white/5 hover:bg-sky-500/15 border-white/5 hover:border-sky-400/30' : 'bg-slate-100 hover:bg-sky-50 border-slate-200 hover:border-sky-300')}>
                          <Share2 className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-slate-400')} />
                        </button>
                        <button className={cn('p-2 rounded-xl transition-all border', isDark ? 'bg-white/5 hover:bg-violet-500/15 border-white/5 hover:border-violet-400/30' : 'bg-slate-100 hover:bg-violet-50 border-slate-200 hover:border-violet-300')}>
                          <Download className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-slate-400')} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full border-2 text-[9px] font-black uppercase tracking-wider" style={{
                    background: `${activeSong.accentColor}18`,
                    color: activeSong.accentColor,
                    borderColor: `${activeSong.accentColor}40`
                  }}>{activeSong.emotion}</span>
                      <span className={cn('px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border-2', isDark ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/30' : 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200')}>{currentVariant?.genre ?? activeSong.genre}</span>
                      {currentVariant && <span className={cn('px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border-2', isDark ? 'bg-violet-500/15 text-violet-300 border-violet-400/30' : 'bg-violet-50 text-violet-600 border-violet-200')}>{currentVariant.tempo}</span>}
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', tk.surface)}>
                    <div className="flex justify-center mb-5">
                      <WaveformBars isPlaying={isPlaying} count={44} colorClass="from-fuchsia-500 to-violet-400" />
                    </div>

                    {/* Seek bar */}
                    <div className="mb-5">
                      <div className={cn('h-1.5 w-full rounded-full cursor-pointer relative group', isDark ? 'bg-white/8' : 'bg-slate-200')} onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setProgress(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)));
                  }}>
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full" style={{
                      width: `${progress}%`
                    }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-fuchsia-900/50 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                      left: `${progress}%`,
                      marginLeft: '-8px'
                    }} />
                      </div>
                      <div className={cn('flex justify-between text-[9px] font-black mt-2', tk.dimmed)}>
                        <span>{formatDuration(progress / 100 * activeSong.duration)}</span>
                        <span>{formatDuration(activeSong.duration)}</span>
                      </div>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-center gap-5 mb-5">
                      <button onClick={() => setIsShuffle(p => !p)} className={cn('transition-colors', isShuffle ? 'text-fuchsia-400' : isDark ? 'text-white/20 hover:text-fuchsia-400' : 'text-slate-300 hover:text-fuchsia-500')}><Shuffle className="w-4 h-4" /></button>
                      <button className={cn('transition-colors', isDark ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-slate-800')}><SkipBack className="w-5 h-5 fill-current" /></button>
                      <button onClick={() => setIsPlaying(!isPlaying)} className={cn('w-16 h-16 bg-gradient-to-br from-white to-fuchsia-100 rounded-full flex items-center justify-center shadow-xl shadow-fuchsia-900/40 hover:scale-105 active:scale-95 transition-all border-4 border-white/20')}>
                        {isPlaying ? <Pause className="w-7 h-7 text-black fill-current" /> : <Play className="w-7 h-7 text-black fill-current translate-x-px" />}
                      </button>
                      <button className={cn('transition-colors', isDark ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-slate-800')}><SkipForward className="w-5 h-5 fill-current" /></button>
                      <button onClick={() => setIsRepeat(p => !p)} className={cn('transition-colors', isRepeat ? 'text-fuchsia-400' : isDark ? 'text-white/20 hover:text-fuchsia-400' : 'text-slate-300 hover:text-fuchsia-500')}><Repeat className="w-4 h-4" /></button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-2.5">
                      <Volume2 className={cn('w-3.5 h-3.5 flex-shrink-0', tk.dimmed)} />
                      <div className={cn('flex-grow h-1.5 rounded-full cursor-pointer relative', isDark ? 'bg-white/8' : 'bg-slate-200')} onClick={e => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setVolume(Math.round((e.clientX - r.left) / r.width * 100));
                  }}>
                        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{
                      width: `${volume}%`
                    }} />
                      </div>
                      <span className={cn('text-[9px] w-6 text-right font-bold', tk.dimmed)}>{volume}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeSong.tags.map(tag => <span key={tag} className={cn('px-2.5 py-1 rounded-full text-[10px] border font-semibold', isDark ? 'bg-white/5 text-white/35 border-white/8' : 'bg-slate-100 text-slate-500 border-slate-200')}>#{tag}</span>)}
                  </div>
                </div>

                {/* ── RIGHT ── */}
                <div className="flex flex-col gap-5">

                  {/* Variant Selector */}
                  <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-fuchsia-400/15' : 'bg-white/80 border-fuchsia-200')}>
                    <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-4', tk.sectionLabel)}>Alternate Timelines</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeSong.variants.map(v => <button key={v.variant} onClick={() => {
                    setActiveVariant(v.variant);
                    setShowFuture(false);
                  }} className={cn('flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-2xl text-xs font-black transition-all border-2', activeVariant === v.variant && !showFuture ? `bg-gradient-to-br ${v.color} text-white border-transparent shadow-lg` : `${v.bgColor} text-white/40 hover:text-white/80`)}>
                          <span className="text-xl">{v.icon}</span>
                          <span className="text-[10px] font-black">{v.label}</span>
                          <span className="text-[8px] opacity-60">{v.genre}</span>
                        </button>)}
                      <button onClick={() => setShowFuture(p => !p)} className={cn('flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-2xl text-xs font-black transition-all border-2', showFuture ? 'bg-gradient-to-br from-teal-400 to-cyan-400 text-white border-transparent shadow-lg' : 'bg-teal-500/15 border-teal-400/35 text-teal-400 hover:text-teal-200')}>
                        <span className="text-xl">⏳</span>
                        <span className="text-[10px] font-black">Future</span>
                        <span className="text-[8px] opacity-60">+10 Years</span>
                      </button>
                    </div>
                  </div>

                  {/* Content Tabs */}
                  <div className={cn('border-2 rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-fuchsia-400/15' : 'bg-white/80 border-fuchsia-200')}>
                    <div className={cn('px-6 py-4 border-b-2', isDark ? 'border-white/[0.05]' : 'border-slate-100')}>
                      <p className={cn('text-[9px] font-black uppercase tracking-[0.15em]', tk.sectionLabel)}>All Echoes — Detailed View</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className={cn('border-b text-[9px] font-black uppercase tracking-[0.15em]', isDark ? 'border-white/[0.04]' : 'border-slate-100')}>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3 hidden md:table-cell">Memory</th>
                            <th className="px-6 py-3 hidden sm:table-cell">Mood</th>
                            <th className="px-6 py-3 hidden lg:table-cell">Timelines</th>
                            <th className="px-6 py-3 hidden lg:table-cell">Duration</th>
                            <th className="px-6 py-3 hidden lg:table-cell">Plays</th>
                            <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {library.map(song => <tr key={song.id} className={cn('group border-b transition-all cursor-pointer', isDark ? 'border-white/[0.03]' : 'border-slate-50')} onClick={() => playSong(song)}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={song.coverUrl} className={cn('w-10 h-10 rounded-xl object-cover flex-shrink-0 opacity-60 group-hover:opacity-100 transition-all border', isDark ? 'border-white/8' : 'border-slate-200')} alt={song.title} />
                                  <div>
                                    <p className={cn('font-black text-xs', isDark ? 'text-white' : 'text-slate-900')}>{song.title}</p>
                                    <p className={cn('text-[9px]', tk.dimmed)}>{song.genre}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 hidden md:table-cell">
                                <p className={cn('text-[10px] line-clamp-1 max-w-[200px] italic', tk.muted)}>{song.memory}</p>
                              </td>
                              <td className="px-6 py-4 hidden sm:table-cell">
                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border-2" style={{
                            background: `${song.accentColor}18`,
                            color: song.accentColor,
                            borderColor: `${song.accentColor}40`
                          }}>{song.emotion}</span>
                              </td>
                              <td className="px-6 py-4 hidden lg:table-cell">
                                <div className="flex gap-0.5">{song.variants.map(v => <span key={v.variant} className="text-xs" title={v.label}>{v.icon}</span>)}<span className="text-xs" title="+10 Years">⏳</span></div>
                              </td>
                              <td className="px-6 py-4 hidden lg:table-cell"><span className={cn('text-[10px] font-semibold', tk.muted)}>{formatDuration(song.duration)}</span></td>
                              <td className="px-6 py-4 hidden lg:table-cell"><span className={cn('text-[10px] font-semibold', tk.muted)}>{song.plays.toLocaleString()}</span></td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={e => {
                              e.stopPropagation();
                              setHeartedSongs(prev => {
                                const next = new Set(prev);
                                next.has(song.id) ? next.delete(song.id) : next.add(song.id);
                                return next;
                              });
                            }} className={cn('p-1.5 rounded-lg transition-all', isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100')}>
                                    <Heart className={cn('w-3.5 h-3.5 transition-colors', heartedSongs.has(song.id) ? 'text-pink-400 fill-pink-400' : isDark ? 'text-white/20' : 'text-slate-300')} />
                                  </button>
                                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all border', isDark ? 'bg-fuchsia-500/20 group-hover:bg-fuchsia-500/40 border-fuchsia-400/20' : 'bg-fuchsia-100 group-hover:bg-fuchsia-200 border-fuchsia-200')}>
                                    <Play className="w-3 h-3 text-fuchsia-500 fill-current translate-x-px" />
                                  </div>
                                </div>
                              </td>
                            </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Memory Card */}
                  <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', isDark ? 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/8 border-fuchsia-400/20' : 'bg-gradient-to-br from-violet-50 to-fuchsia-50 border-fuchsia-200')}>
                    <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-4', tk.sectionLabel)}>Memory Card</p>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={activeSong.coverUrl} className={cn('w-14 h-14 rounded-2xl object-cover flex-shrink-0 border-2', isDark ? 'border-white/10' : 'border-slate-200')} alt={activeSong.title} />
                      <div className="min-w-0">
                        <h3 className={cn('font-black text-sm truncate', isDark ? 'text-white' : 'text-slate-900')}>{activeSong.title}</h3>
                        <p className={cn('text-[10px] mt-0.5 line-clamp-1 italic', tk.muted)}>{activeSong.memory}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-2.5 h-2.5 text-fuchsia-500" />
                          <p className={cn('text-[9px] font-semibold', tk.dimmed)}>{activeSong.mapLocation.city} · {activeSong.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      {[{
                    label: 'Plays',
                    val: activeSong.plays.toLocaleString()
                  }, {
                    label: 'Scenes',
                    val: activeSong.scenes.length
                  }, {
                    label: 'Timelines',
                    val: activeSong.variants.length + 1
                  }].map(s => <div key={s.label} className={cn('rounded-xl p-2 border-2', isDark ? 'bg-white/5 border-white/[0.06]' : 'bg-slate-50 border-slate-200')}>
                          <p className={cn('text-sm font-black', isDark ? 'text-white' : 'text-slate-900')}>{s.val}</p>
                          <p className={cn('text-[8px] uppercase tracking-widest', tk.dimmed)}>{s.label}</p>
                        </div>)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowShareCard(true)} className="flex-1 py-2.5 bg-white text-black text-[11px] font-black rounded-xl flex items-center justify-center gap-1.5 hover:bg-fuchsia-100 transition-all">
                        <Share2 className="w-3 h-3" />
                        <span>Share Card</span>
                      </button>
                      <button onClick={() => setView('map')} className="flex-1 py-2.5 bg-lime-500/15 border-2 border-lime-400/30 text-lime-600 text-[11px] font-black rounded-xl hover:bg-lime-500/25 transition-all flex items-center justify-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span>World Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>}

          {/* ════════════════════════════════════ LIBRARY ════════════════════════════════════ */}
          {view === 'library' && <motion.section key="library" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="p-6 md:p-10">

              {/* Flow Banner */}
              <motion.div initial={{
            opacity: 0,
            y: -8
          }} animate={{
            opacity: 1,
            y: 0
          }} className={cn('flex items-center justify-between px-4 py-2.5 rounded-2xl border-2', flowBanner.color)}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{flowBanner.icon}</span>
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/60' : 'text-slate-600')}>Landing</span>
                  <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                  <span className="text-xs font-black text-sky-500">Library ✦</span>
                  <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/30' : 'text-slate-400')}>Player</span>
                </div>
                <button onClick={() => setView(flowBanner.nextView)} className={cn('text-[10px] font-black flex items-center gap-1 transition-colors', isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
                  <span>{flowBanner.next}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

              <div className="mb-8">
                <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-5', isDark ? 'bg-fuchsia-500/15 border-fuchsia-400/30' : 'bg-fuchsia-50 border-fuchsia-200')}>
                  <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                  <span className={cn('text-[9px] font-black uppercase tracking-[0.18em]', isDark ? 'text-fuchsia-300' : 'text-fuchsia-600')}>Memory Box</span>
                </div>
                <h2 className={cn('text-4xl font-black mb-2', isDark ? 'text-white' : 'text-slate-900')}>Memory Box</h2>
                <p className={cn('text-sm max-w-xl', tk.muted)}>Every moment you've turned into sound.</p>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[{
              label: 'Total Songs',
              val: library.length.toString(),
              icon: Music,
              color: 'text-violet-500',
              bg: isDark ? 'bg-violet-500/15 border-violet-400/25' : 'bg-violet-50 border-violet-200'
            }, {
              label: 'Total Plays',
              val: library.reduce((a, s) => a + s.plays, 0).toLocaleString(),
              icon: Headphones,
              color: 'text-pink-500',
              bg: isDark ? 'bg-pink-500/15 border-pink-400/25' : 'bg-pink-50 border-pink-200'
            }, {
              label: 'Cities',
              val: new Set(library.map(s => s.mapLocation.city)).size.toString(),
              icon: MapPin,
              color: 'text-sky-500',
              bg: isDark ? 'bg-sky-500/15 border-sky-400/25' : 'bg-sky-50 border-sky-200'
            }, {
              label: 'Timelines',
              val: (library.length * 4).toString(),
              icon: Layers,
              color: 'text-teal-500',
              bg: isDark ? 'bg-teal-500/15 border-teal-400/25' : 'bg-teal-50 border-teal-200'
            }].map(stat => <div key={stat.label} className={cn('border-2 rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-sm', stat.bg)}>
                    <stat.icon className={cn('w-5 h-5 flex-shrink-0', stat.color)} />
                    <div>
                      <p className={cn('text-lg font-black', isDark ? 'text-white' : 'text-slate-900')}>{stat.val}</p>
                      <p className={cn('text-[9px] uppercase tracking-widest', tk.dimmed)}>{stat.label}</p>
                    </div>
                  </div>)}
              </div>

              {/* Song cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {filteredLibrary.map(song => <motion.div key={song.id} whileHover={{
              y: -3,
              scale: 1.01
            }} className={cn('group rounded-3xl overflow-hidden border-2 transition-all cursor-pointer backdrop-blur-sm', tk.card, tk.cardBorder, tk.cardHover)} onClick={() => playSong(song)}>
                    <div className="aspect-video relative overflow-hidden">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50 group-hover:opacity-85" />
                      <div className={cn('absolute inset-0 bg-gradient-to-t to-transparent', isDark ? 'from-[#060410] via-[#060410]/25' : 'from-slate-900/60 via-slate-900/10')} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"><Play className="w-5 h-5 text-white fill-white" /></div>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[9px] font-black text-violet-300 border border-violet-400/25">{song.scenes.length} scenes</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-sm font-black text-white mb-0.5">{song.title}</h4>
                        <p className="text-[10px] text-white/40 line-clamp-1">{song.memory}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded-full border-2 text-[9px] font-black uppercase" style={{
                    background: `${song.accentColor}18`,
                    color: song.accentColor,
                    borderColor: `${song.accentColor}40`
                  }}>{song.emotion}</span>
                        <span className={cn('text-[9px] font-semibold', tk.muted)}>{song.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn('text-[9px] font-black uppercase tracking-widest', tk.dimmed)}>{song.genre}</span>
                        <span className={cn('text-[8px]', tk.faint)}>{song.plays.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>)}
              </div>

              {filteredLibrary.length === 0 && <div className="text-center py-20">
                  <p className={cn('text-sm', tk.muted)}>No memories match your search.</p>
                  <button onClick={() => setLibrarySearch('')} className="mt-3 text-fuchsia-500 underline text-xs hover:text-fuchsia-700 transition-colors font-bold">Clear search</button>
                </div>}

              {/* Table */}
              <div className={cn('rounded-3xl border-2 overflow-hidden backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-slate-200')}>
                <div className={cn('px-6 py-4 border-b-2', isDark ? 'border-white/[0.05]' : 'border-slate-100')}>
                  <p className={cn('text-[9px] font-black uppercase tracking-[0.2em]', tk.sectionLabel)}>All Echoes — Detailed View</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={cn('border-b text-[9px] font-black uppercase tracking-[0.15em]', isDark ? 'border-white/[0.04]' : 'border-slate-100')}>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3 hidden md:table-cell">Memory</th>
                        <th className="px-6 py-3 hidden sm:table-cell">Mood</th>
                        <th className="px-6 py-3 hidden lg:table-cell">Timelines</th>
                        <th className="px-6 py-3 hidden lg:table-cell">Duration</th>
                        <th className="px-6 py-3 hidden lg:table-cell">Plays</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {library.map(song => <tr key={song.id} className={cn('group border-b transition-all cursor-pointer', isDark ? 'border-white/[0.03]' : 'border-slate-50')} onClick={() => playSong(song)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={song.coverUrl} className={cn('w-10 h-10 rounded-xl object-cover flex-shrink-0 opacity-60 group-hover:opacity-100 transition-all border', isDark ? 'border-white/8' : 'border-slate-200')} alt={song.title} />
                              <div>
                                <p className={cn('font-black text-xs', isDark ? 'text-white' : 'text-slate-900')}>{song.title}</p>
                                <p className={cn('text-[9px]', tk.dimmed)}>{song.genre}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <p className={cn('text-[10px] line-clamp-1 max-w-[200px] italic', tk.muted)}>{song.memory}</p>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border-2" style={{
                        background: `${song.accentColor}18`,
                        color: song.accentColor,
                        borderColor: `${song.accentColor}40`
                      }}>{song.emotion}</span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="flex gap-0.5">{song.variants.map(v => <span key={v.variant} className="text-xs" title={v.label}>{v.icon}</span>)}<span className="text-xs" title="+10 Years">⏳</span></div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell"><span className={cn('text-[10px] font-semibold', tk.muted)}>{formatDuration(song.duration)}</span></td>
                          <td className="px-6 py-4 hidden lg:table-cell"><span className={cn('text-[10px] font-semibold', tk.muted)}>{song.plays.toLocaleString()}</span></td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={e => {
                          e.stopPropagation();
                          setHeartedSongs(prev => {
                            const next = new Set(prev);
                            next.has(song.id) ? next.delete(song.id) : next.add(song.id);
                            return next;
                          });
                        }} className={cn('p-1.5 rounded-lg transition-all', isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100')}>
                                <Heart className={cn('w-3.5 h-3.5 transition-colors', heartedSongs.has(song.id) ? 'text-pink-400 fill-pink-400' : isDark ? 'text-white/20' : 'text-slate-300')} />
                              </button>
                              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center transition-all border', isDark ? 'bg-fuchsia-500/20 group-hover:bg-fuchsia-500/40 border-fuchsia-400/20' : 'bg-fuchsia-100 group-hover:bg-fuchsia-200 border-fuchsia-200')}>
                                <Play className="w-3 h-3 text-fuchsia-500 fill-current translate-x-px" />
                              </div>
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>}

          {/* ════════════════════════════════════ MAP ════════════════════════════════════ */}
          {view === 'map' && <motion.section key="map" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="p-6 md:p-10">

              {/* Flow Banner */}
              <motion.div initial={{
            opacity: 0,
            y: -8
          }} animate={{
            opacity: 1,
            y: 0
          }} className={cn('flex items-center justify-between px-4 py-2.5 rounded-2xl border-2', flowBanner.color)}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{flowBanner.icon}</span>
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/60' : 'text-slate-600')}>Library</span>
                  <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                  <span className="text-xs font-black text-lime-600">World Map ✦</span>
                  <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                  <span className={cn('text-xs font-bold', isDark ? 'text-white/30' : 'text-slate-400')}>Talk Mode</span>
                </div>
                <button onClick={() => setView(flowBanner.nextView)} className={cn('text-[10px] font-black flex items-center gap-1 transition-colors', isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
                  <span>{flowBanner.next}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>

              <div className="mb-8">
                <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-5', isDark ? 'bg-lime-500/20 border-lime-400/30' : 'bg-lime-50 border-lime-200')}>
                  <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                  <span className={cn('text-[9px] font-black uppercase tracking-[0.18em]', isDark ? 'text-lime-300' : 'text-lime-600')}>Memory Therapy Mode</span>
                </div>
                <h2 className={cn('text-4xl font-black mb-2', isDark ? 'text-white' : 'text-slate-900')}>Talk to Your Memory</h2>
                <p className={cn('text-sm max-w-xl', tk.muted)}>Describe your memory to the AI. As you share more, the music evolves in real time.</p>
              </div>

              {/* Stats ribbon */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {[{
              label: 'Active Memories',
              val: '12,849',
              icon: Music,
              color: 'text-violet-500',
              bg: isDark ? 'bg-violet-500/15 border-violet-400/25' : 'bg-violet-50 border-violet-200'
            }, {
              label: 'Countries',
              val: '74',
              icon: Globe,
              color: 'text-lime-500',
              bg: isDark ? 'bg-lime-500/15 border-lime-400/25' : 'bg-lime-50 border-lime-200'
            }, {
              label: 'Cities',
              val: '184',
              icon: MapPin,
              color: 'text-sky-500',
              bg: isDark ? 'bg-sky-500/15 border-sky-400/25' : 'bg-sky-50 border-sky-200'
            }, {
              label: 'Songs Created',
              val: '9,240',
              icon: Headphones,
              color: 'text-fuchsia-500',
              bg: isDark ? 'bg-fuchsia-500/15 border-fuchsia-400/25' : 'bg-fuchsia-50 border-fuchsia-200'
            }, {
              label: 'Listeners Now',
              val: '1,024',
              icon: Users,
              color: 'text-amber-500',
              bg: isDark ? 'bg-amber-500/15 border-amber-400/25' : 'bg-amber-50 border-amber-200'
            }].map(s => <div key={s.label} className={cn('flex-shrink-0 border-2 rounded-2xl px-4 py-3 flex items-center gap-2.5 backdrop-blur-sm', s.bg)}>
                    <s.icon className={cn('w-3.5 h-3.5 flex-shrink-0', s.color)} />
                    <div>
                      <p className={cn('text-sm font-black', isDark ? 'text-white' : 'text-slate-900')}>{s.val}</p>
                      <p className={cn('text-[8px] uppercase tracking-widest', tk.dimmed)}>{s.label}</p>
                    </div>
                  </div>)}
              </div>

              {/* Map */}
              <div className={cn('relative w-full rounded-3xl overflow-hidden border-2 shadow-2xl mb-8', isDark ? 'bg-[#04020b] border-white/[0.06]' : 'bg-slate-800 border-slate-600')} style={{
            paddingBottom: '50%'
          }}>
                <div className="absolute inset-0">
                  <div className="absolute inset-0" style={{
                background: isDark ? 'radial-gradient(ellipse at 50% 50%, #130930 0%, #06020f 60%)' : 'radial-gradient(ellipse at 50% 50%, #1e1b4b 0%, #0f172a 60%)'
              }} />
                  {/* Grid lines */}
                  <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-[0.05]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    {Array.from({
                  length: 11
                }, (_, i) => ({
                  id: `h${i}`,
                  y: i * 50
                })).map(l => <line key={l.id} x1="0" y1={l.y} x2="1000" y2={l.y} stroke="#a855f7" strokeWidth="0.5" />)}
                    {Array.from({
                  length: 21
                }, (_, i) => ({
                  id: `v${i}`,
                  x: i * 50
                })).map(l => <line key={l.id} x1={l.x} y1="0" x2={l.x} y2="500" stroke="#a855f7" strokeWidth="0.5" />)}
                  </svg>
                  {/* World map - proper continent outlines */}
                  <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="continentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.38" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.22" />
                      </linearGradient>
                    </defs>
                    {/* North America — New York at (235,150) */}
                    <path d="M 135 60 L 158 48 L 185 44 L 210 46 L 230 52 L 245 64 L 252 80 L 255 98 L 262 112 L 270 126 L 272 140 L 268 154 L 260 164 L 248 172 L 238 182 L 228 196 L 220 210 L 212 226 L 205 242 L 198 258 L 192 272 L 185 280 L 178 278 L 170 265 L 162 252 L 155 238 L 148 224 L 142 210 L 138 196 L 132 182 L 126 168 L 122 154 L 120 140 L 118 126 L 120 112 L 124 98 L 128 84 L 132 72 L 135 60 Z M 182 280 L 192 275 L 200 283 L 198 296 L 188 305 L 178 306 L 170 297 L 170 285 L 182 280 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.55" />
                    {/* Greenland */}
                    <path d="M 210 15 L 232 8 L 252 10 L 265 20 L 268 34 L 260 46 L 246 52 L 228 52 L 214 44 L 206 32 L 210 15 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.45" />
                    {/* Iceland */}
                    <path d="M 378 36 L 392 28 L 408 30 L 416 42 L 410 54 L 395 58 L 380 54 L 373 44 L 378 36 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.45" />
                    {/* South America — São Paulo at (275,350) */}
                    <path d="M 220 268 L 238 258 L 258 255 L 278 258 L 294 268 L 304 282 L 308 298 L 306 316 L 300 334 L 292 352 L 282 368 L 272 382 L 260 392 L 248 398 L 235 396 L 224 385 L 215 370 L 208 353 L 205 334 L 204 315 L 206 296 L 210 278 L 220 268 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.55" />
                    {/* Europe — London (430,80), Paris (460,95), Berlin (495,75) */}
                    <path d="M 390 60 L 408 52 L 428 50 L 445 54 L 458 62 L 470 72 L 478 84 L 480 98 L 475 112 L 464 122 L 450 128 L 436 130 L 422 126 L 410 118 L 400 108 L 392 96 L 390 82 L 390 60 Z M 478 84 L 495 76 L 512 78 L 522 88 L 520 102 L 510 110 L 496 112 L 482 106 L 478 94 L 478 84 Z M 422 50 L 438 44 L 450 48 L 454 58 L 448 66 L 435 68 L 422 62 L 418 52 L 422 50 Z M 435 44 L 444 38 L 452 42 L 452 50 L 444 56 L 436 52 L 435 44 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.55" />
                    {/* Scandinavia */}
                    <path d="M 458 24 L 468 16 L 478 18 L 484 28 L 480 40 L 470 46 L 460 42 L 455 32 L 458 24 Z M 480 20 L 492 14 L 502 18 L 504 30 L 498 40 L 486 40 L 480 30 L 480 20 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.45" />
                    {/* Africa — Lagos at (470,260) */}
                    <path d="M 436 148 L 458 140 L 480 138 L 500 142 L 516 154 L 524 170 L 526 188 L 524 206 L 520 224 L 514 242 L 506 260 L 496 278 L 484 295 L 472 310 L 460 322 L 448 330 L 436 332 L 424 326 L 414 314 L 406 298 L 400 280 L 397 262 L 396 244 L 398 226 L 400 208 L 402 190 L 406 174 L 414 160 L 425 151 L 436 148 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.55" />
                    {/* Arabian Peninsula */}
                    <path d="M 535 170 L 550 162 L 566 164 L 578 174 L 582 190 L 578 208 L 568 220 L 555 226 L 542 222 L 532 210 L 530 194 L 533 180 L 535 170 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.5" />
                    {/* Asia main — Mumbai (635,220), Seoul (742,120), Tokyo (762,130) */}
                    <path d="M 520 50 L 545 42 L 572 40 L 600 44 L 628 50 L 655 56 L 680 62 L 705 68 L 726 76 L 745 86 L 758 98 L 764 112 L 760 126 L 748 136 L 734 142 L 718 148 L 702 154 L 685 158 L 668 162 L 650 166 L 632 168 L 614 168 L 596 165 L 578 160 L 560 155 L 545 148 L 532 140 L 522 130 L 516 118 L 515 104 L 516 90 L 518 76 L 520 62 L 520 50 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.55" />
                    {/* Indian Subcontinent — Mumbai (635,220) */}
                    <path d="M 598 165 L 618 160 L 636 165 L 648 178 L 652 194 L 648 212 L 638 228 L 625 242 L 610 252 L 598 255 L 586 250 L 578 238 L 575 222 L 578 206 L 585 192 L 594 178 L 598 165 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.55" />
                    {/* Southeast Asia / Indochina */}
                    <path d="M 680 158 L 698 150 L 714 152 L 724 164 L 722 180 L 712 192 L 698 198 L 684 194 L 675 182 L 676 168 L 680 158 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.5" />
                    {/* Japan — Tokyo (762,130) */}
                    <path d="M 756 110 L 766 104 L 774 108 L 774 122 L 766 130 L 756 128 L 750 118 L 756 110 Z M 768 90 L 776 84 L 784 88 L 784 100 L 776 106 L 766 102 L 765 92 L 768 90 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.6" />
                    {/* Korea — Seoul (742,120) */}
                    <path d="M 736 110 L 746 105 L 752 110 L 752 124 L 745 130 L 736 126 L 733 116 L 736 110 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.6" strokeOpacity="0.55" />
                    {/* Australia — Sydney (805,350) */}
                    <path d="M 724 295 L 748 283 L 774 278 L 800 280 L 822 290 L 838 304 L 844 322 L 840 340 L 828 356 L 812 368 L 794 376 L 774 378 L 754 372 L 736 360 L 722 344 L 714 325 L 716 308 L 724 295 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.55" />
                    {/* New Zealand */}
                    <path d="M 864 362 L 870 354 L 876 358 L 876 370 L 870 376 L 862 372 L 864 362 Z M 868 344 L 874 336 L 880 340 L 880 352 L 874 356 L 866 352 L 868 344 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.5" />
                    {/* Indonesia */}
                    <path d="M 722 225 L 736 218 L 750 220 L 756 232 L 750 242 L 736 244 L 724 236 L 722 225 Z M 752 238 L 768 230 L 782 234 L 786 246 L 778 256 L 764 256 L 752 248 L 752 238 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.6" strokeOpacity="0.5" />
                    {/* Madagascar */}
                    <path d="M 534 274 L 542 266 L 550 270 L 552 285 L 548 300 L 540 308 L 532 305 L 528 290 L 530 278 L 534 274 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.6" strokeOpacity="0.5" />
                    {/* British Isles */}
                    <path d="M 420 62 L 428 56 L 436 58 L 438 68 L 432 76 L 422 76 L 418 68 L 420 62 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.6" strokeOpacity="0.5" />
                    {/* Sri Lanka */}
                    <path d="M 645 260 L 650 254 L 656 258 L 656 268 L 650 272 L 644 268 L 645 260 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.4" strokeOpacity="0.5" />
                    {/* Taiwan */}
                    <path d="M 752 160 L 758 154 L 764 158 L 764 170 L 758 174 L 752 170 L 752 160 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.4" strokeOpacity="0.5" />
                    {/* Philippines */}
                    <path d="M 756 192 L 764 185 L 772 188 L 774 200 L 768 208 L 758 206 L 754 197 L 756 192 Z" fill="url(#continentGrad)" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.5" />
                  </svg>
                </div>
              </div>

              {/* City cards */}
              <div>
                <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-5', tk.sectionLabel)}>Trending Memory Cities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {MAP_PINS.map(pin => <div key={pin.city} className={cn('border-2 rounded-2xl p-4 transition-all cursor-pointer group backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-white/[0.05] hover:border-violet-400/30' : 'bg-white/70 border-slate-200 hover:border-violet-300')} onClick={() => setHoveredPin(hoveredPin === pin.city ? null : pin.city)}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', pin.dotColor)} />
                        <span className={cn('text-xs font-black transition-colors', isDark ? 'text-white/70 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900')}>{pin.city}</span>
                      </div>
                      <p className={cn('text-[9px] italic line-clamp-2 mb-2', tk.muted)}>"{pin.memory}"</p>
                      <div className="flex items-center justify-between">
                        <span className={cn('text-[8px] font-black uppercase tracking-widest', tk.dimmed)}>{pin.genre}</span>
                        <span className={cn('text-[8px]', tk.faint)}>{pin.plays.toLocaleString()}</span>
                      </div>
                    </div>)}
                </div>
              </div>

              {/* Genre bars */}
              <div className={cn('mt-8 border-2 rounded-3xl p-6 backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-slate-200')}>
                <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-5', tk.sectionLabel)}>Global Genre Distribution</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {MAP_PINS.slice(0, 5).map((pin, i) => <div key={pin.city} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={cn('text-[10px] font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{pin.genre}</span>
                        <span className={cn('text-[9px] font-bold', isDark ? 'text-white/20' : 'text-slate-300')}>{Math.round(pin.plays / MAP_PINS.reduce((a, p) => a + p.plays, 0) * 100)}%</span>
                      </div>
                      <div className={cn('h-2 rounded-full overflow-hidden border', isDark ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-slate-200')}>
                        <motion.div className={cn('h-full rounded-full', pin.dotColor)} initial={{
                    width: 0
                  }} animate={{
                    width: `${Math.round(pin.plays / MAP_PINS.reduce((a, p) => a + p.plays, 0) * 100)}%`
                  }} transition={{
                    duration: 1,
                    delay: i * 0.12,
                    ease: 'easeOut'
                  }} />
                      </div>
                    </div>)}
                </div>
              </div>
            </motion.section>}

          {/* ════════════════════════════════════ TALK ════════════════════════════════════ */}
          {view === 'talk' && <motion.section key="talk" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="p-6 md:p-10">
              <div className="max-w-5xl mx-auto">

                {/* Flow Banner */}
                <motion.div initial={{
              opacity: 0,
              y: -8
            }} animate={{
              opacity: 1,
              y: 0
            }} className={cn('flex items-center justify-between px-4 py-2.5 rounded-2xl border-2', flowBanner.color)}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{flowBanner.icon}</span>
                    <span className={cn('text-xs font-bold', isDark ? 'text-white/60' : 'text-slate-600')}>Map</span>
                    <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                    <span className="text-xs font-black text-fuchsia-500">Talk Mode ✦</span>
                    <ChevronRight className={cn('w-3 h-3', isDark ? 'text-white/20' : 'text-slate-300')} />
                    <span className={cn('text-xs font-bold', isDark ? 'text-white/30' : 'text-slate-400')}>Home</span>
                  </div>
                  <button onClick={() => setView(flowBanner.nextView)} className={cn('text-[10px] font-black flex items-center gap-1 transition-colors', isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900')}>
                    <span>{flowBanner.next}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>

                <div className="mb-8">
                  <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-5', isDark ? 'bg-fuchsia-500/15 border-fuchsia-400/30' : 'bg-fuchsia-50 border-fuchsia-200')}>
                    <Wand2 className="w-3 h-3 text-fuchsia-500" />
                    <span className={cn('text-[9px] font-black uppercase tracking-[0.18em]', isDark ? 'text-fuchsia-300' : 'text-fuchsia-600')}>Memory Therapy Mode</span>
                  </div>
                  <h2 className={cn('text-4xl font-black mb-2', isDark ? 'text-white' : 'text-slate-900')}>Talk to Your Memory</h2>
                  <p className={cn('text-sm max-w-xl', tk.muted)}>Describe your memory to the AI. As you share more, the music evolves in real time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                  <div className="flex flex-col gap-4">
                    {/* Active song strip */}
                    {activeSong ? <div className={cn('flex items-center gap-4 p-4 border-2 rounded-2xl backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-fuchsia-400/20' : 'bg-white/80 border-fuchsia-200')}>
                        <img src={activeSong.coverUrl} className={cn('w-12 h-12 rounded-xl object-cover flex-shrink-0 border', isDark ? 'border-white/10' : 'border-slate-200')} alt={activeSong.title} />
                        <div className="flex-grow min-w-0">
                          <p className={cn('font-black text-sm truncate', isDark ? 'text-white' : 'text-slate-900')}>{activeSong.title}</p>
                          <p className="text-[10px] text-fuchsia-500 mt-0.5 font-semibold">Evolving based on your conversation...</p>
                          <div className="mt-1"><WaveformBars isPlaying={isPlaying} count={20} compact colorClass="from-fuchsia-500 to-violet-400" /></div>
                        </div>
                        <button onClick={() => setIsPlaying(!isPlaying)} className={cn('w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0', isDark ? 'bg-fuchsia-500/20 border-fuchsia-400/30 hover:bg-fuchsia-500/40' : 'bg-fuchsia-100 border-fuchsia-200 hover:bg-fuchsia-200')}>
                          {isPlaying ? <Pause className="w-4 h-4 text-fuchsia-500 fill-current" /> : <Play className="w-4 h-4 text-fuchsia-500 fill-current translate-x-px" />}
                        </button>
                      </div> : <div className={cn('p-5 border-2 border-dashed rounded-2xl text-center', isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-300')}>
                        <p className={cn('text-sm', tk.muted)}>No song active. <button onClick={() => setView('landing')} className="text-fuchsia-500 underline underline-offset-4 hover:text-fuchsia-700 transition-colors font-bold">Create one first</button></p>
                      </div>}

                    {/* Chat window */}
                    <div className={cn('border-2 rounded-3xl overflow-hidden flex flex-col backdrop-blur-sm', isDark ? 'bg-[#07041a]' : 'bg-slate-50')}>
                      <div className={cn('flex items-center justify-between px-5 py-3.5 border-b-2', isDark ? 'border-white/[0.05]' : 'border-slate-100')}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                          <span className={cn('text-[9px] font-black uppercase tracking-widest', isDark ? 'text-fuchsia-400' : 'text-fuchsia-600')}>AI is listening</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span className={cn('text-[9px] font-black', isDark ? 'text-amber-400/70' : 'text-amber-600')}>Music evolves as you talk</span>
                        </div>
                      </div>

                      <div className="h-[420px] overflow-y-auto p-5 space-y-4">
                        {chatMessages.map(msg => <motion.div key={msg.id} initial={{
                      opacity: 0,
                      y: 8
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      duration: 0.25
                    }} className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                            {msg.role === 'ai' && <div className={cn('w-7 h-7 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-fuchsia-900/40 border border-white/10')}>
                                <Music className="w-3.5 h-3.5 text-white" />
                              </div>}
                            <div className="max-w-[80%] space-y-1.5">
                              <div className={cn('rounded-2xl px-4 py-3 text-sm leading-relaxed border-2', msg.role === 'user' ? tk.chatBubbleUser : tk.chatBubbleAi)}>
                                {msg.emotion && <p className={cn('text-[8px] font-black uppercase tracking-[0.2em] mb-1', isDark ? 'text-fuchsia-400' : 'text-fuchsia-600')}>{msg.emotion}</p>}
                                <p>{msg.text}</p>
                              </div>
                              {msg.musicUpdate && <div className={cn('flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-xl', isDark ? 'bg-amber-500/10 border-amber-400/20' : 'bg-amber-50 border-amber-200')}>
                                  <RefreshCw className="w-2.5 h-2.5 text-amber-500" />
                                  <span className={cn('text-[9px] font-black', isDark ? 'text-amber-300' : 'text-amber-700')}>{msg.musicUpdate}</span>
                                </div>}
                              <p className={cn('text-[8px] px-1 font-semibold', tk.faint)}>{msg.timestamp}</p>
                            </div>
                            {msg.role === 'user' && <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2', isDark ? 'bg-violet-500/25 border-violet-400/30' : 'bg-violet-100 border-violet-200')}>
                                <span className={cn('text-[10px] font-black', isDark ? 'text-violet-300' : 'text-violet-600')}>U</span>
                              </div>}
                          </motion.div>)}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Mood chips */}
                      <div className={cn('px-5 py-3 border-t flex items-center gap-2 overflow-x-auto', isDark ? 'border-white/[0.04]' : 'border-slate-100')}>
                        <span className={cn('text-[8px] font-black uppercase tracking-[0.2em] flex-shrink-0', tk.faint)}>Mood:</span>
                        {['😔 Sad', '😊 Happy', '😤 Angry', '😌 Calm', '😰 Anxious', '🥹 Grateful'].map(emo => <button key={emo} onClick={() => {
                      const name = emo.split(' ')[1].toLowerCase();
                      const aiMsg: ChatMessage = {
                        id: `emo-${Date.now()}`,
                        role: 'ai',
                        text: `Feeling ${name} — I'm shifting the key and tempo to match. Your memory is taking on a new emotional color right now.`,
                        emotion: 'adapting',
                        timestamp: new Date().toLocaleTimeString('en', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }),
                        musicUpdate: `Key: shifted · Tempo: adjusted · Mood: ${name}`
                      };
                      setChatMessages(prev => [...prev, aiMsg]);
                    }} className={cn('flex-shrink-0 px-2.5 py-1 border-2 rounded-xl text-[10px] font-semibold transition-all', isDark ? 'bg-white/5 border-white/8 text-white/40 hover:bg-fuchsia-500/15 hover:text-fuchsia-300 hover:border-fuchsia-400/30' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-fuchsia-300 hover:bg-fuchsia-50')}>
                            {emo}
                          </button>)}
                      </div>

                      <div className={cn('p-4 border-t flex gap-2.5', isDark ? 'border-white/[0.04]' : 'border-slate-100')}>
                        <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Tell me more about this memory..." className={cn('flex-grow border-2 rounded-2xl px-4 py-2.5 text-sm focus:outline-none transition-all', tk.input)} />
                        <button onClick={sendChat} disabled={!chatInput.trim()} className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 rounded-2xl flex items-center justify-center transition-all active:scale-95 border-2 border-white/10">
                          <Send className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['I regret not saying goodbye', 'That day changed everything', 'I still think about it often', 'I wish I could go back', "It was the happiest I've ever been", "I didn't know it was the last time"].map(p => <button key={p} onClick={() => setChatInput(p)} className={cn('px-3 py-1.5 border-2 rounded-xl text-[10px] font-semibold transition-all', isDark ? 'bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white hover:border-fuchsia-400/30 hover:bg-fuchsia-500/8' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-fuchsia-300 hover:bg-fuchsia-50')}>{p}</button>)}
                    </div>
                  </div>

                  {/* Right sidebar */}
                  <div className="space-y-4">
                    <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-fuchsia-400/15' : 'bg-white/80 border-fuchsia-200')}>
                      <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-4', tk.sectionLabel)}>Live Music State</p>
                      <div className="space-y-3">
                        {[{
                      label: 'Emotion',
                      val: activeSong?.emotion ?? 'unset',
                      icon: Heart,
                      color: 'text-pink-500',
                      bg: isDark ? 'bg-pink-400/10' : 'bg-pink-50'
                    }, {
                      label: 'Tempo',
                      val: '96 BPM',
                      icon: Zap,
                      color: 'text-amber-500',
                      bg: isDark ? 'bg-amber-400/10' : 'bg-amber-50'
                    }, {
                      label: 'Key',
                      val: 'A Minor',
                      icon: Music,
                      color: 'text-violet-500',
                      bg: isDark ? 'bg-violet-400/10' : 'bg-violet-50'
                    }, {
                      label: 'Genre',
                      val: activeSong?.genre ?? 'Ambient',
                      icon: Radio,
                      color: 'text-sky-500',
                      bg: isDark ? 'bg-sky-400/10' : 'bg-sky-50'
                    }, {
                      label: 'Reverb',
                      val: '42%',
                      icon: Wind,
                      color: 'text-teal-500',
                      bg: isDark ? 'bg-teal-400/10' : 'bg-teal-50'
                    }].map(item => <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center', item.bg)}>
                                <item.icon className={cn('w-3 h-3', item.color)} />
                              </div>
                              <span className={cn('text-[9px] font-semibold', tk.muted)}>{item.label}</span>
                            </div>
                            <span className={cn('text-[9px] font-black', isDark ? 'text-white/60' : 'text-slate-700')}>{item.val}</span>
                          </div>)}
                      </div>
                      <div className={cn('mt-5 pt-4 border-t', isDark ? 'border-white/[0.06]' : 'border-slate-100')}>
                        <p className={cn('text-[9px] mb-3 font-black uppercase tracking-widest', tk.sectionLabel)}>Conversation Impact</p>
                        <div className="space-y-2">
                          {[{
                        label: 'Emotional depth',
                        pct: 78,
                        color: 'from-pink-500 to-rose-500'
                      }, {
                        label: 'Lyric specificity',
                        pct: 62,
                        color: 'from-violet-500 to-fuchsia-500'
                      }, {
                        label: 'Sonic evolution',
                        pct: 45,
                        color: 'from-sky-500 to-cyan-500'
                      }].map(item => <div key={item.label} className="space-y-1">
                              <div className="flex justify-between">
                                <span className={cn('text-[9px] font-semibold', tk.muted)}>{item.label}</span>
                                <span className={cn('text-[9px] font-bold', tk.dimmed)}>{item.pct}%</span>
                              </div>
                              <div className={cn('h-1.5 rounded-full overflow-hidden border', isDark ? 'bg-white/5 border-white/5' : 'bg-slate-200 border-slate-200')}>
                                <motion.div className={cn('h-full bg-gradient-to-r rounded-full', item.color)} initial={{
                            width: 0
                          }} animate={{
                            width: `${item.pct}%`
                          }} transition={{
                            duration: 1,
                            ease: 'easeOut'
                          }} />
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>

                    <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-fuchsia-400/15' : 'bg-white/80 border-fuchsia-200')}>
                      <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-4', tk.sectionLabel)}>How It Works</p>
                      <div className="space-y-3">
                        {[{
                      step: '01',
                      label: 'You describe the memory',
                      sub: 'Any detail, any emotion',
                      color: isDark ? 'bg-violet-500/20 text-violet-300 border-violet-400/30' : 'bg-violet-100 text-violet-700 border-violet-200'
                    }, {
                      step: '02',
                      label: 'AI parses the feeling',
                      sub: 'Sentiment, context, intensity',
                      color: isDark ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30' : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
                    }, {
                      step: '03',
                      label: 'Music parameters shift',
                      sub: 'Tempo, key, instruments',
                      color: isDark ? 'bg-pink-500/20 text-pink-300 border-pink-400/30' : 'bg-pink-100 text-pink-700 border-pink-200'
                    }, {
                      step: '04',
                      label: 'Lyrics rewrite live',
                      sub: 'In real time as you talk',
                      color: isDark ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 'bg-amber-100 text-amber-700 border-amber-200'
                    }].map(item => <div key={item.step} className="flex gap-3 items-start">
                            <span className={cn('text-[9px] font-black px-2 py-0.5 rounded-lg border-2 flex-shrink-0', item.color)}>{item.step}</span>
                            <div>
                              <p className={cn('text-[11px] font-black', isDark ? 'text-white/60' : 'text-slate-700')}>{item.label}</p>
                              <p className={cn('text-[9px]', tk.dimmed)}>{item.sub}</p>
                            </div>
                          </div>)}
                      </div>
                    </div>

                    <div className={cn('border-2 rounded-3xl p-5 backdrop-blur-sm', isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/80 border-slate-200')}>
                      <p className={cn('text-[9px] font-black uppercase tracking-[0.2em] mb-4', tk.sectionLabel)}>Session Stats</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[{
                      label: 'Messages',
                      val: chatMessages.length.toString(),
                      bg: isDark ? 'bg-violet-500/15 border-violet-400/25' : 'bg-violet-50 border-violet-200',
                      valColor: isDark ? 'text-violet-300' : 'text-violet-700'
                    }, {
                      label: 'Updates',
                      val: chatMessages.filter(m => m.musicUpdate).length.toString(),
                      bg: isDark ? 'bg-amber-500/15 border-amber-400/25' : 'bg-amber-50 border-amber-200',
                      valColor: isDark ? 'text-amber-300' : 'text-amber-700'
                    }, {
                      label: 'Avg depth',
                      val: '84%',
                      bg: isDark ? 'bg-pink-500/15 border-pink-400/25' : 'bg-pink-50 border-pink-200',
                      valColor: isDark ? 'text-pink-300' : 'text-pink-700'
                    }, {
                      label: 'Emotions',
                      val: new Set(chatMessages.filter(m => m.emotion).map(m => m.emotion)).size.toString(),
                      bg: isDark ? 'bg-teal-500/15 border-teal-400/25' : 'bg-teal-50 border-teal-200',
                      valColor: isDark ? 'text-teal-300' : 'text-teal-700'
                    }].map(s => <div key={s.label} className={cn('text-center rounded-xl py-2.5 border-2', s.bg)}>
                            <p className={cn('text-sm font-black', s.valColor)}>{s.val}</p>
                            <p className={cn('text-[8px] uppercase tracking-widest', tk.dimmed)}>{s.label}</p>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>}

        </AnimatePresence>
      </main>

      {/* ═══ MINI PLAYER ═══ */}
      <AnimatePresence>
        {activeSong && view !== 'player' && view !== 'generating' && <motion.div initial={{
        y: 100,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={{
        y: 100,
        opacity: 0
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }} className="fixed bottom-0 left-0 right-0 md:left-56 z-[100]">
            <div className={cn('h-[3px]', isDark ? 'bg-white/5' : 'bg-slate-200')}>
              <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-100" style={{
            width: `${progress}%`
          }} />
            </div>
            <div className={cn('h-[72px] backdrop-blur-2xl border-t-2 px-5 flex items-center justify-between', tk.playerBg, tk.playerBorder)}>
              <div className="flex items-center gap-3 cursor-pointer flex-shrink-0 min-w-0 max-w-[200px] md:max-w-[280px]" onClick={() => setView('player')}>
                <img src={activeSong.coverUrl} className={cn('w-11 h-11 rounded-xl object-cover flex-shrink-0 border-2', isDark ? 'border-white/10' : 'border-slate-200')} alt={activeSong.title} />
                <div className="min-w-0">
                  <p className={cn('font-black text-xs truncate', isDark ? 'text-white' : 'text-slate-900')}>{activeSong.title}</p>
                  <p className={cn('text-[9px] truncate font-semibold', tk.muted)}>{activeSong.genre}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button className={cn('hidden sm:block transition-colors', isDark ? 'text-white/20 hover:text-white' : 'text-slate-300 hover:text-slate-800')}><SkipBack className="w-4 h-4 fill-current" /></button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-gradient-to-br from-white to-fuchsia-100 rounded-full flex items-center justify-center shadow-lg shadow-fuchsia-900/30 hover:scale-105 active:scale-95 transition-all border-2 border-white/20">
                  {isPlaying ? <Pause className="w-4 h-4 text-black fill-current" /> : <Play className="w-4 h-4 text-black fill-current translate-x-px" />}
                </button>
                <button className={cn('hidden sm:block transition-colors', isDark ? 'text-white/20 hover:text-white' : 'text-slate-300 hover:text-slate-800')}><SkipForward className="w-4 h-4 fill-current" /></button>
              </div>
              <div className="hidden lg:flex items-center gap-3 w-44">
                <WaveformBars isPlaying={isPlaying} count={14} compact colorClass="from-fuchsia-500 to-violet-400" />
                <Volume2 className={cn('w-3.5 h-3.5 flex-shrink-0', tk.dimmed)} />
                <div className={cn('h-1.5 flex-grow rounded-full cursor-pointer', isDark ? 'bg-white/8' : 'bg-slate-200')} onClick={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setVolume(Math.round((e.clientX - r.left) / r.width * 100));
            }}>
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{
                width: `${volume}%`
              }} />
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

    </div>;
};