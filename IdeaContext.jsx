import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const IdeaContext = createContext();

// High fidelity mock ideas to seed the community feed
const INITIAL_COMMUNITY_IDEAS = [
  {
    id: 'demo-1',
    userId: 'mock-user-1',
    userEmail: 'alice@siliconvalley.com',
    userName: 'Alice Mercer',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    title: 'Autonomous Drone Pollination for Vertical Farms',
    description: 'We are building micro-drones that navigate indoor vertical farms to autonomously pollinate strawberry and tomato crops, replacing manual labor and increasing yield consistency.',
    location: 'City',
    businessModel: 'Physical',
    viability_score: 84,
    summary: 'A futuristic AgriTech solution targeting indoor farms with automation.',
    strengths: [
      'High efficiency compared to manual pollination',
      'Proprietary computer vision navigation system',
      'Strong fit for high-density indoor crop growers'
    ],
    risks: [
      'High initial hardware and R&D costs',
      'Battery life limits operational duty cycles',
      'Vulnerability of delicate flowers to drone rotor airflow'
    ],
    suggestions: [
      'Partner with existing greenhouse suppliers as a plug-in service',
      'Offer a hardware-as-a-service lease option to lower adoption barriers',
      'Develop micro-flapping wing models to minimize airflow disturbance'
    ],
    market_category: 'AgriTech / Robotics',
    risk_level: 'High',
    confidence: 'High',
    current_demand: 'Growing rapidly due to global water crises and the expansion of indoor controlled-environment agriculture.',
    boom_potential: 'High. Crop yields increase by 15-20% and labor dependence drops, offering immediate ROI to commercial growers.',
    location_impact: 'Ideal for cities and urban centers where vertical farming facilities are located to reduce transit times.',
    sharks: [
      { type: 'Aggressive Investor', opinion: 'The margins are solid once scaled, and indoor farms have budget. But hardware is a slow path to liquidity. I need to see a recurring SaaS model for the drone software.', invest: 'Yes', reason: 'Large commercial farming contracts will make this highly profitable.' },
      { type: 'Product Expert', opinion: 'Indoor navigation is a solved problem but battery swap cycles will be your product bottleneck. The auto-docking charger needs to be flawless.', invest: 'Yes', reason: 'Saves 30% on labor costs and eliminates crop yield variations.' },
      { type: 'Skeptical Investor', opinion: 'One crash ruins a crop shelf. The liability is massive. Plus, manual pollination, while tedious, doesn\'t require a tech support team.', invest: 'No', reason: 'Extreme capital intensity and operational liability risk.' },
      { type: 'Visionary Investor', opinion: 'This solves a key link in building climate-resilient cities. Vertical farming is our future, and pollinating is their biggest hurdle.', invest: 'Yes', reason: 'High long-term sustainability impact.' }
    ],
    final_verdict: 'Invest',
    improved_idea: 'RoboPollen: A hybrid autonomous pollination fleet offering Drone + Static mechanical vibrational nodes, sold as a monthly Pollination-as-a-Service subscription package.',
    key_changes: [
      'Introduced static mechanical agitators for sturdy crops to reduce drone count',
      'Switched from outright sales to a subscription based on yield increases',
      'Added crop health analytics software to drone cameras'
    ],
    expected_improvement: 'Boosts viability score to 92/100 by lowering initial customer capital costs and securing recurring revenue.',
    future_prediction: {
      best_case: 'Sign 3 major urban vertical farm networks, securing $2.5M in ARR and 95% crop yield success.',
      worst_case: 'Regulatory approval delays on drone flight in indoor food production zones, or high hardware breakage rates drain cash.',
      most_likely: 'Local pilots succeed. You sign one large greenhouse network and raise a Seed round.',
      success_probability: 72
    },
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    isPublic: true,
    likes: ['eswari@example.com', 'demo-user-2@test.com'],
    comments: [
      { id: 'c1', userEmail: 'founder@tech.io', userName: 'Devin', userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devin', text: 'This is brilliant. How do the drones handle dusty conditions in urban greenhouses?', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() }
    ],
    lastUpdatedTimestamps: { core: Date.now(), sharks: Date.now(), mentor: Date.now(), future: Date.now() }
  },
  {
    id: 'demo-2',
    userId: 'mock-user-2',
    userEmail: 'bob@builders.org',
    userName: 'Bob Peterson',
    userPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    title: 'Hyperlocal Peer-to-Peer Tool Rental App',
    description: 'A mobile app that lets neighbors rent out their home improvement tools (drills, ladders, lawnmowers) to others in their immediate neighborhood, utilizing smart locks for key exchange.',
    location: 'Village',
    businessModel: 'Physical',
    viability_score: 52,
    summary: 'A sharing economy app for home tools, but facing heavy community density constraints.',
    strengths: [
      'Low cost to start since users supply the inventory',
      'Promotes community circular economy and reduces waste',
      'Highly useful for occasional-use heavy items'
    ],
    risks: [
      'Very low average transaction values make fees small',
      'Liability for broken tools or physical injury during use',
      'Severe supply/demand imbalance in small towns or villages'
    ],
    suggestions: [
      'Pivot to City focus or target suburban homeowner associations',
      'Incorporate commercial tool rental shops onto the platform as core suppliers',
      'Provide comprehensive insurance policies covering up to $500 per tool'
    ],
    market_category: 'Sharing Economy / PropTech',
    risk_level: 'High',
    confidence: 'Medium',
    current_demand: 'Moderate in dense cities, but extremely low in villages/suburbs where neighbors already share or own basic tools.',
    boom_potential: 'Low to Medium. Hard to scale cost-effectively due to high user acquisition and insurance costs.',
    location_impact: 'Weak viability in a Village location where dense networks don\'t exist. Location selection strongly hurts this business.',
    sharks: [
      { type: 'Aggressive Investor', opinion: 'The average transaction size is $15. If you take 20%, you make $3 per rental. How many rentals do you need to pay for a developer? Thousands a day. No scale.', invest: 'No', reason: 'Unit economics do not make sense.' },
      { type: 'Product Expert', opinion: 'Nice concept, but tool maintenance and pick-up logistics will turn users off. It is easier to just drive to Home Depot.', invest: 'No', reason: 'Friction in tool exchange is too high.' },
      { type: 'Skeptical Investor', opinion: 'What happens when someone gets injured by a rented chainsaw? The lawsuits will bankrupt the company before you get to V2.', invest: 'No', reason: 'High liability risk and low margins.' },
      { type: 'Visionary Investor', opinion: 'I love the circular economy aspect. If we can get communities to share instead of buy, we reduce consumerism. But it needs to start in dense apartments.', invest: 'Yes', reason: 'Reduces consumer waste and fosters neighborly connections.' }
    ],
    final_verdict: 'Not Invest',
    improved_idea: 'ToolBox Share: Micro-hubs placed in apartment complexes where the company owns high-quality tools in smart lockers, rented hourly via a subscription.',
    key_changes: [
      'Shifted from peer-to-peer to company-owned high-quality inventory in dense hubs',
      'Implemented a subscription model (e.g. $9/mo for access to any tool)',
      'Partnered with property management companies for free space'
    ],
    expected_improvement: 'Improves score to 79/100 by solving the reliability, safety, and inventory-density problems.',
    future_prediction: {
      best_case: 'Launch in 50 major apartment buildings, securing 5,000 active subscribers paying $9.99/month.',
      worst_case: 'High vandalism or theft of tools, combined with slow subscription signups, kills the company.',
      most_likely: 'A few building trials work, but slow expansion limits growth. You pivot to targeting corporate spaces.',
      success_probability: 45
    },
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    isPublic: true,
    likes: ['alice@siliconvalley.com'],
    comments: [],
    lastUpdatedTimestamps: { core: Date.now(), sharks: Date.now(), mentor: Date.now(), future: Date.now() }
  }
];

const APP_KEY = '3fngr9mr';
const CHUNK_SIZE = 200; // Keep within IIS segment limit of 260 chars
const KEY_PREFIX = 'ideaforge_hackathon_db';

// Helper to encode to safe base64 in browser
function toSafeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  const b64 = btoa(binString);
  return b64.replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}

// Helper to decode from safe base64 in browser
function fromSafeBase64(safeB64) {
  let b64 = safeB64.replace(/_/g, '/').replace(/-/g, '+');
  while (b64.length % 4) { b64 += '='; }
  const binString = atob(b64);
  const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export const IdeaProvider = ({ children }) => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem('ideaforge_ideas');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(idea => ({
            ...idea,
            likes: Array.isArray(idea.likes) ? idea.likes : [],
            comments: Array.isArray(idea.comments) ? idea.comments : [],
            sharks: Array.isArray(idea.sharks) ? idea.sharks : []
          }));
        }
      }
    } catch (e) {
      console.error("Failed to parse saved ideas from localStorage, resetting to initial seed:", e);
    }
    // Seed default ideas
    localStorage.setItem('ideaforge_ideas', JSON.stringify(INITIAL_COMMUNITY_IDEAS));
    return INITIAL_COMMUNITY_IDEAS;
  });

  const [feedback, setFeedback] = useState(() => {
    const saved = localStorage.getItem('ideaforge_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const isSyncingFromCloud = useRef(false);

  const syncFromCloud = async () => {
    try {
      isSyncingFromCloud.current = true;
      const countRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/${KEY_PREFIX}_count`);
      if (!countRes.ok) throw new Error("Failed to get count");
      let countStr = (await countRes.json()) || "";
      if (countStr.startsWith('"') && countStr.endsWith('"')) {
        countStr = countStr.substring(1, countStr.length - 1);
      }
      const count = parseInt(countStr, 10);

      if (isNaN(count) || count <= 0) {
        // Cloud is empty, seed it with initial ideas
        console.log("Cloud db empty, seeding initial ideas...");
        await publishToCloud(INITIAL_COMMUNITY_IDEAS);
        setIdeas(INITIAL_COMMUNITY_IDEAS);
        return;
      }

      console.log(`Cloud db has ${count} chunks, loading...`);
      let combinedB64 = '';
      for (let i = 0; i < count; i++) {
        const chunkRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/${KEY_PREFIX}_chunk_${i}`);
        if (!chunkRes.ok) throw new Error(`Failed to get chunk ${i}`);
        let chunk = (await chunkRes.json()) || "";
        if (chunk.startsWith('"') && chunk.endsWith('"')) {
          chunk = chunk.substring(1, chunk.length - 1);
        }
        combinedB64 += chunk;
      }

      const decoded = fromSafeBase64(combinedB64);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("Cloud db sync success, item count:", parsed.length);
        setIdeas(parsed);
      }
    } catch (err) {
      console.error("Failed to sync from cloud db:", err);
    } finally {
      isSyncingFromCloud.current = false;
    }
  };

  const publishToCloud = async (ideasData) => {
    try {
      const jsonString = JSON.stringify(ideasData);
      const safeB64 = toSafeBase64(jsonString);
      const chunks = [];
      for (let i = 0; i < safeB64.length; i += CHUNK_SIZE) {
        chunks.push(safeB64.substring(i, i + CHUNK_SIZE));
      }

      console.log(`Publishing payload of length ${jsonString.length} into ${chunks.length} chunks to cloud db...`);

      // 1. Save count
      await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/${KEY_PREFIX}_count/${chunks.length}`, { method: 'POST' });

      // 2. Save chunks
      for (let i = 0; i < chunks.length; i++) {
        await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/${KEY_PREFIX}_chunk_${i}/${chunks[i]}`, { method: 'POST' });
      }
      console.log("Cloud db publish complete!");
    } catch (err) {
      console.error("Failed to publish to cloud db:", err);
    }
  };

  // Initial load and polling sync from cloud
  useEffect(() => {
    syncFromCloud();
    const interval = setInterval(syncFromCloud, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  // Migrate any local guest evaluations to the user's account upon login
  useEffect(() => {
    if (user) {
      setIdeas(prev => {
        let changed = false;
        const updated = prev.map(idea => {
          if (idea.userId === 'guest-user') {
            changed = true;
            return {
              ...idea,
              userId: user.uid,
              userEmail: user.email,
              userName: user.displayName || 'Developer Founder',
              userPhoto: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
            };
          }
          return idea;
        });
        if (changed) {
          return updated;
        }
        return prev;
      });
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ideaforge_ideas', JSON.stringify(ideas));
    if (!isSyncingFromCloud.current) {
      publishToCloud(ideas);
    }
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('ideaforge_feedback', JSON.stringify(feedback));
  }, [feedback]);

  // Save or update an idea
  const saveIdea = (ideaData) => {
    setIdeas(prev => {
      const index = prev.findIndex(item => item.id === ideaData.id);
      const timestamp = new Date().toISOString();
      
      if (index > -1) {
        // Update existing
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          ...ideaData,
          updatedAt: timestamp
        };
        return updated;
      } else {
        // Create new
        return [
          {
            ...ideaData,
            createdAt: timestamp,
            updatedAt: timestamp,
            likes: ideaData.likes || [],
            comments: ideaData.comments || []
          },
          ...prev
        ];
      }
    });
  };

  // Delete idea
  const deleteIdea = (id) => {
    setIdeas(prev => prev.filter(item => item.id !== id));
  };

  // Toggle Like
  const likeIdea = (id, userEmail) => {
    if (!userEmail) return;
    setIdeas(prev => prev.map(item => {
      if (item.id === id) {
        const likes = [...item.likes];
        const index = likes.indexOf(userEmail);
        if (index > -1) {
          likes.splice(index, 1);
        } else {
          likes.push(userEmail);
        }
        return { ...item, likes };
      }
      return item;
    }));
  };

  // Add Comment
  const addComment = (id, commentText, user) => {
    if (!user) return;
    const comment = {
      id: Math.random().toString(36).substring(7),
      userEmail: user.email,
      userName: user.displayName || user.email.split('@')[0],
      userPhoto: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    setIdeas(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          comments: [...item.comments, comment]
        };
      }
      return item;
    }));
  };

  // Submit bug report or improvement feedback
  const submitFeedback = (email, type, message) => {
    const newReport = {
      id: Math.random().toString(36).substring(7),
      email,
      type, // 'bug' | 'suggestion'
      message,
      createdAt: new Date().toISOString()
    };
    setFeedback(prev => [newReport, ...prev]);
    return newReport;
  };

  return (
    <IdeaContext.Provider value={{
      ideas,
      feedback,
      saveIdea,
      deleteIdea,
      likeIdea,
      addComment,
      submitFeedback
    }}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdeas = () => useContext(IdeaContext);
