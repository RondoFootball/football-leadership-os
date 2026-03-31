export type PlayerLine =
  | "goalkeeper"
  | "defence"
  | "midfield"
  | "attack";

export type PlayerUnit =
  | "goalkeeper"
  | "centre_back"
  | "full_back"
  | "wing_back"
  | "defensive_midfielder"
  | "central_midfielder"
  | "attacking_midfielder"
  | "winger"
  | "striker"
  | "second_striker";

export type RoleContext =
  | "academy"
  | "first_team"
  | "elite_schedule"
  | "universal";

export type DevelopmentStage = "foundation" | "advanced" | "performance";

export type TacticalVariant =
  | "generic"
  | "build_up_heavy"
  | "transition_heavy"
  | "pressing_heavy"
  | "low_block_heavy"
  | "positional_play_heavy";

export type RoleProfile = {
  id: PlayerUnit;
  label: string;
  line: PlayerLine;
  contexts: RoleContext[];

  rolePurpose: string[];

  roleTensions: string[];

  gamePhases: {
    inPossession: string[];
    outOfPossession: string[];
    offensiveTransition: string[];
    defensiveTransition: string[];
  };

  behaviouralDemands: {
    perception: string[];
    decisionMaking: string[];
    execution: string[];
    communication?: string[];
    emotionalControl?: string[];
  };

  successBehaviours: string[];

  commonBreakdowns: string[];

  riskPatterns: string[];

  diagnosticCues: string[];

  developmentDirections: string[];

  interventionDirections: {
    individual: string[];
    tactical: string[];
    coaching: string[];
    review: string[];
  };

  coachingLanguage: string[];

  observationPrompts: string[];

  planAngles: string[];

  contextAdjustments: Record<
    RoleContext,
    {
      emphasis: string[];
      deprioritise?: string[];
      warning?: string[];
    }
  >;

  stageAdjustments: Record<
    DevelopmentStage,
    {
      focus: string[];
      avoid?: string[];
    }
  >;

  tacticalAdjustments: Partial<
    Record<
      TacticalVariant,
      {
        emphasis: string[];
        warning?: string[];
      }
    >
  >;
};

export const roleProfiles: Record<PlayerUnit, RoleProfile> = {
  goalkeeper: {
    id: "goalkeeper",
    label: "Goalkeeper",
    line: "goalkeeper",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Protect the goal through timing, positioning, composure and decisive action.",
      "Give structural stability in build-up and behind the defensive line.",
      "Act as an information source for the team through scanning and communication.",
      "Switch effectively between last defender, goal protector and first distributor."
    ],

    roleTensions: [
      "Calm versus urgency.",
      "Proactive depth control versus goal protection.",
      "Short build-up support versus direct release.",
      "Commanding presence versus emotional control."
    ],

    gamePhases: {
      inPossession: [
        "Create stable access points in build-up under pressure.",
        "Recognise whether the moment asks for circulation, fixation, switch or direct release.",
        "Support positional structure through body angle and passing tempo.",
        "Make the next action easier for defenders and midfielders."
      ],
      outOfPossession: [
        "Protect the goal through positioning before reaction.",
        "Manage depth behind the line and reduce open-space exposure.",
        "Control crosses, cutbacks and second actions with conviction.",
        "Organise defenders early and functionally."
      ],
      offensiveTransition: [
        "Recognise when quick release gives the team immediate advantage.",
        "Restart with speed only when the picture is actually on.",
        "Slow the game when chaos would hurt the next action."
      ],
      defensiveTransition: [
        "Read danger before the final action exists.",
        "Manage distances to line, striker and ball trajectory.",
        "Decide early whether to hold, cover, clear or attack."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans pressure, distances, free men, body shapes and line height.",
        "Reads opponent intention before the ball reaches the final zone.",
        "Recognises whether the game needs control or acceleration."
      ],
      decisionMaking: [
        "Chooses the distribution action that serves the collective picture.",
        "Decides early whether the situation is for holding, attacking or delaying.",
        "Balances bravery and game security under pressure."
      ],
      execution: [
        "Plays with clean technique under time pressure.",
        "Moves efficiently through early set position and controlled footwork.",
        "Executes final actions with commitment rather than hesitation."
      ],
      communication: [
        "Communicates early, clearly and with functional content.",
        "Helps defenders read line height, cover and immediate danger.",
        "Supports emotional calm in unstable moments."
      ],
      emotionalControl: [
        "Recovers quickly from errors.",
        "Looks stable when the game speeds up.",
        "Keeps action quality under external pressure."
      ]
    },

    successBehaviours: [
      "Looks one action ahead.",
      "Supports build-up without becoming the problem.",
      "Protects depth before danger becomes obvious.",
      "Acts decisively in final moments.",
      "Gives calm to the line."
    ],

    commonBreakdowns: [
      "Acts after the picture instead of before it.",
      "Supports short build-up without reading pressure structure.",
      "Stays too passive behind a high line.",
      "Communicates too late or too vaguely.",
      "Lets one mistake affect the next action."
    ],

    riskPatterns: [
      "Overvaluing feet at the expense of goal protection.",
      "Waiting behaviour disguised as composure.",
      "Forced distribution after already losing the picture.",
      "Box actions without authority.",
      "Emotional instability after mistakes."
    ],

    diagnosticCues: [
      "Does he set before the action or react after it?",
      "Does his build-up behaviour improve the team picture or merely continue possession?",
      "How early does he solve depth threats?",
      "When under pressure, does his communication clarify or increase noise?",
      "Do mistakes shrink or sharpen his next behaviour?"
    ],

    developmentDirections: [
      "Improve pre-action scanning and early set behaviour.",
      "Sharpen build-up decisions under layered pressure.",
      "Increase proactive depth control behind the line.",
      "Improve decisiveness on crosses, loose balls and 1v1 moments.",
      "Strengthen emotional reset after unstable actions."
    ],

    interventionDirections: {
      individual: [
        "Train pre-scan routines before goal kicks and back-passes.",
        "Repeat depth-control decisions with variable line heights.",
        "Use final-action repetition with delayed cues rather than predictable service.",
        "Train emotional reset behaviour between repetitions."
      ],
      tactical: [
        "Clarify which build-up pictures demand short continuation and which demand release.",
        "Define goalkeeper relation to line height and centre-back behaviour.",
        "Reduce ambiguity in cross-control responsibilities."
      ],
      coaching: [
        "Coach earlier pictures, not only visible outcomes.",
        "Reward correct decisions even when execution fails.",
        "Use specific language around set position, timing and next action."
      ],
      review: [
        "Review 3 moments before ball contact, not only the final touch.",
        "Tag build-up choices by picture quality, not by pass completion alone.",
        "Separate technical failure from reading failure."
      ]
    },

    coachingLanguage: [
      "Set first, then act.",
      "See the picture before the ball arrives.",
      "Protect the space before you protect the shot.",
      "Decide early: hold, attack, delay or release.",
      "Give the team calm, not doubt."
    ],

    observationPrompts: [
      "What does the goalkeeper know before receiving?",
      "How does he influence the next team action in build-up?",
      "When space opens behind the line, how early does he respond?",
      "Does he look authoritative in final defensive moments?",
      "How stable is he after a mistake?"
    ],

    planAngles: [
      "Build-up behaviour under pressure",
      "Depth management behind the line",
      "Final-action decisiveness",
      "Communication linked to organisation",
      "Emotional control and reset behaviour"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "Scanning before receiving",
          "Body orientation in build-up",
          "Basic depth courage",
          "Clear simple communication"
        ],
        warning: [
          "Do not over-load with complex build-up solutions too early.",
          "Do not mistake technical polish for game understanding."
        ]
      },
      first_team: {
        emphasis: [
          "Reliability under pressure",
          "Decision speed",
          "Box authority",
          "Game-state management"
        ],
        warning: [
          "Do not let stylistic preferences undermine defensive certainty."
        ]
      },
      elite_schedule: {
        emphasis: [
          "Emotional stability",
          "repeatability under fatigue",
          "simple high-value decisions",
          "load-aware concentration control"
        ],
        warning: [
          "Avoid overcomplicating build-up under physical and cognitive fatigue."
        ]
      },
      universal: {
        emphasis: ["Positioning before reaction", "game clarity", "decisive action"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: [
          "Set position",
          "basic scanning",
          "clean first distribution",
          "simple communication"
        ],
        avoid: ["Over-detailing tactical variants too early"]
      },
      advanced: {
        focus: [
          "Depth-control timing",
          "pressure reading",
          "choice under complexity",
          "box command"
        ]
      },
      performance: {
        focus: [
          "repeatability",
          "decision speed under stress",
          "game management",
          "high-pressure reliability"
        ]
      }
    },

    tacticalAdjustments: {
      build_up_heavy: {
        emphasis: [
          "Scanning before first contact",
          "fix-and-release behaviour",
          "central support angles"
        ],
        warning: ["Do not confuse involvement with value."]
      },
      transition_heavy: {
        emphasis: [
          "fast restart recognition",
          "depth protection",
          "box readiness"
        ]
      },
      positional_play_heavy: {
        emphasis: [
          "positional support discipline",
          "ball circulation tempo",
          "helping the next line receive well"
        ]
      }
    }
  },

  centre_back: {
    id: "centre_back",
    label: "Centre Back",
    line: "defence",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Provide central defensive stability and first-line progression.",
      "Control direct opponents, central danger and space behind the line.",
      "Support collective build-up without sacrificing defensive balance."
    ],

    roleTensions: [
      "Security versus progression.",
      "Defending forward versus protecting depth.",
      "Duel aggression versus line stability.",
      "Ball courage versus structural discipline."
    ],

    gamePhases: {
      inPossession: [
        "Progress through carry, line-breaking pass or fixation.",
        "Recognise when to attract pressure and when to release.",
        "Support circulation with correct angle, spacing and tempo.",
        "Help the team enter the next line cleanly."
      ],
      outOfPossession: [
        "Protect central access and the goal.",
        "Manage line height, striker relation and depth control.",
        "Defend crosses, direct play and second balls with timing.",
        "Keep the line connected under pressure."
      ],
      offensiveTransition: [
        "Secure rest defence or step into progression when clearly on.",
        "Recognise whether the game asks for stabilisation or immediate forward action."
      ],
      defensiveTransition: [
        "Read whether to step, delay, cover or drop.",
        "Protect the most dangerous central outcome first.",
        "Restore compactness without passive retreat."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans striker behaviour, pressure structure, next-line access and depth risk.",
        "Reads where own action changes the team picture.",
        "Recognises when the opponent is unstable enough to progress."
      ],
      decisionMaking: [
        "Chooses between carry, pass, set or switch based on real pressure picture.",
        "Decides whether defending forward improves or hurts line stability.",
        "Balances duel action with collective central protection."
      ],
      execution: [
        "Carries with control and intention.",
        "Passes with weight and direction that accelerate the next action.",
        "Defends duels through timing, body use and calm."
      ],
      communication: [
        "Coordinates line height, cover and compactness.",
        "Supports full-backs and midfielders with simple directional cues."
      ],
      emotionalControl: [
        "Stays composed after being turned or exposed once.",
        "Keeps decision quality under direct pressure."
      ]
    },

    successBehaviours: [
      "Progresses without forcing.",
      "Defends danger early.",
      "Keeps central space protected.",
      "Supports line calm under stress.",
      "Improves the build-up picture."
    ],

    commonBreakdowns: [
      "Plays early without fixing pressure.",
      "Carries into traps rather than through advantage.",
      "Steps too late or drops too early.",
      "Wins a duel but loses the situation.",
      "Looks safe while adding little progression value."
    ],

    riskPatterns: [
      "Ball-playing ambition without game control.",
      "Over-defending the striker and losing central access behind.",
      "Passive line protection that invites pressure.",
      "Aggression without cover reference.",
      "Central focus loss after one unstable action."
    ],

    diagnosticCues: [
      "Does he progress the game or just remove himself from risk?",
      "What happens when the striker threatens both feet and depth?",
      "Does he defend the first duel or the whole situation?",
      "When stepping in, does the line stay intact?",
      "How often does his action make the next teammate’s job easier?"
    ],

    developmentDirections: [
      "Improve fix-and-release timing in build-up.",
      "Sharpen recognition of step-versus-hold moments.",
      "Increase central-progression value with low waste.",
      "Improve depth judgement and striker control.",
      "Strengthen line communication in unstable phases."
    ],

    interventionDirections: {
      individual: [
        "Train build-up pictures with manipulated pressure cues.",
        "Repeat step-hold-cover decisions against different striker profiles.",
        "Use duel work linked to second action and line relation."
      ],
      tactical: [
        "Clarify triggers for stepping out versus protecting line.",
        "Define centre-back relation to 6 and full-back in build-up and transition.",
        "Make rest-defence references explicit."
      ],
      coaching: [
        "Coach the whole defensive picture, not isolated duel wins.",
        "Use language around fixing, releasing and protecting central danger."
      ],
      review: [
        "Review pre-pass and pre-duel pictures.",
        "Tag central access control, not only pass success or duel outcome."
      ]
    },

    coachingLanguage: [
      "Fix before you release.",
      "Defend the danger, not only the duel.",
      "See striker, ball and space together.",
      "Step with conviction or hold with control.",
      "Progress with calm."
    ],

    observationPrompts: [
      "How much real progression comes from his actions?",
      "What does he do when the striker threatens depth?",
      "How stable is he when the team loses central protection?",
      "Is he controlling the line or surviving in it?",
      "Does his aggression help the structure?"
    ],

    planAngles: [
      "Progression under pressure",
      "Depth and line control",
      "Step-versus-hold decisions",
      "Central duel management",
      "Rest-defence behaviour"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "body orientation in build-up",
          "defending while seeing ball and striker",
          "basic central protection"
        ],
        warning: [
          "Do not overreward risky progression if the player cannot yet read pressure."
        ]
      },
      first_team: {
        emphasis: [
          "repeatable progression",
          "line control",
          "decision speed",
          "error resistance"
        ]
      },
      elite_schedule: {
        emphasis: [
          "simple reliable choices",
          "duel timing under fatigue",
          "line compactness",
          "second-action discipline"
        ],
        warning: [
          "Avoid cognitive overload in highly repeated game cycles."
        ]
      },
      universal: {
        emphasis: ["central danger control", "progression with security"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: [
          "orientation before receiving",
          "simple progression",
          "basic line reference"
        ]
      },
      advanced: {
        focus: [
          "pressure fixation",
          "depth judgement",
          "defending forward timing"
        ]
      },
      performance: {
        focus: [
          "low-error progression",
          "high-pressure control",
          "game-state leadership"
        ]
      }
    },

    tacticalAdjustments: {
      build_up_heavy: {
        emphasis: [
          "fixing pressure",
          "third-man access",
          "carry to provoke"
        ]
      },
      low_block_heavy: {
        emphasis: [
          "box protection",
          "cross defence",
          "second-ball organisation"
        ]
      },
      pressing_heavy: {
        emphasis: [
          "large-space defending",
          "timing to step",
          "cover behind pressure"
        ]
      }
    }
  },

  full_back: {
    id: "full_back",
    label: "Full Back",
    line: "defence",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Connect side-space control with progression and defensive reliability.",
      "Support build-up and attack without breaking team balance.",
      "Manage large spaces on the outside with good judgement."
    ],

    roleTensions: [
      "Width versus rest defence.",
      "Aggressive pressure versus delay and control.",
      "Supporting high versus protecting inside space.",
      "1v1 bravery versus defensive patience."
    ],

    gamePhases: {
      inPossession: [
        "Offer useful width, support angle or underlap depending on the picture.",
        "Recognise when to hold, advance or invert.",
        "Support progression through timing, not habit.",
        "Make side possession playable and purposeful."
      ],
      outOfPossession: [
        "Control winger, channel and inside lane.",
        "Defend 1v1 with body orientation and patience.",
        "Protect the far post and back-side references when ball is away."
      ],
      offensiveTransition: [
        "Join quickly when space is real.",
        "Secure structure when immediate forward support would expose the team."
      ],
      defensiveTransition: [
        "Recover inside-out when needed.",
        "Protect inside danger before chasing the ball line.",
        "Choose between press, delay, track or recover."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans winger, inside midfielder, channel space and full-width picture.",
        "Reads whether the best action is support, overlap, underlap or restraint.",
        "Recognises side risk after ball loss."
      ],
      decisionMaking: [
        "Chooses the support behaviour that truly helps progression.",
        "Recognises when defending asks for patience over diving in.",
        "Balances forward support with rest-defence responsibility."
      ],
      execution: [
        "Receives cleanly under side-line pressure.",
        "Defends 1v1 with controlled feet and body line.",
        "Recovers with speed and correct line of run."
      ],
      communication: [
        "Coordinates with winger, centre-back and nearest midfielder.",
        "Clarifies pressure and cover roles on the side."
      ],
      emotionalControl: [
        "Does not panic when isolated in space.",
        "Recovers behaviour after being beaten once."
      ]
    },

    successBehaviours: [
      "Becomes available with purpose.",
      "Supports progression without overcommitting.",
      "Defends the side with control.",
      "Protects inside danger in transition.",
      "Times attacking support well."
    ],

    commonBreakdowns: [
      "Runs high without relation to team stability.",
      "Receives wide but cannot continue forward.",
      "Defends too square or too early in 1v1 moments.",
      "Follows the ball and loses inside or far-post danger.",
      "Provides movement but not usefulness."
    ],

    riskPatterns: [
      "Automatic overlap behaviour.",
      "1v1 aggression without delaying skill.",
      "Outside fixation with poor inside awareness.",
      "Late recovery after own attacking action.",
      "Role confusion between winger and full-back tasks."
    ],

    diagnosticCues: [
      "Does his positioning help circulation or just fill a lane?",
      "What is his first reaction after loss?",
      "In 1v1, does he control the attacker or chase the attacker?",
      "How often does he protect the inside before the outside?",
      "Does his forward movement create value or only exposure?"
    ],

    developmentDirections: [
      "Improve support timing in side build-up.",
      "Sharpen receiving body shape under side-line pressure.",
      "Improve 1v1 control on both outside and inside lanes.",
      "Recognise earlier when holding is stronger than going.",
      "Improve transition discipline after advanced positioning."
    ],

    interventionDirections: {
      individual: [
        "Train wide receptions with different pressure pictures.",
        "Repeat 1v1 defending with delay-first tasks.",
        "Use recovery-running tasks with inside-priority cues."
      ],
      tactical: [
        "Clarify when full-back provides width and when winger does.",
        "Define transition responsibilities when full-back is the advanced side player.",
        "Clarify far-side back-post and inside-lane rules."
      ],
      coaching: [
        "Coach usefulness of positioning, not only activity.",
        "Use language around hold, support, protect and recover."
      ],
      review: [
        "Review side actions in relation to rest defence.",
        "Tag 1v1 moments by control quality, not only outcome."
      ]
    },

    coachingLanguage: [
      "Be available with purpose.",
      "Protect inside before you chase outside.",
      "Join on timing, not on impulse.",
      "Delay first, win second.",
      "Make your run help the structure."
    ],

    observationPrompts: [
      "How useful is his side positioning in possession?",
      "What does he do when isolated 1v1?",
      "How disciplined is he after his own forward action?",
      "Does he protect the team when the far side becomes active?",
      "Does he improve side stability or just add movement?"
    ],

    planAngles: [
      "Side support timing",
      "Receiving and continuing from wide areas",
      "1v1 defensive control",
      "Transition discipline",
      "Inside protection and far-side awareness"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "body shape in wide reception",
          "inside-out recovery",
          "1v1 patience"
        ]
      },
      first_team: {
        emphasis: [
          "decision speed on the side",
          "rest-defence awareness",
          "repeatable defensive control"
        ]
      },
      elite_schedule: {
        emphasis: [
          "economical running choices",
          "defensive reliability",
          "clear role discipline"
        ],
        warning: [
          "Avoid unnecessary high actions that create repeated transition load."
        ]
      },
      universal: {
        emphasis: ["side control", "support usefulness", "transition discipline"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["simple support positions", "1v1 control basics", "recovery lines"]
      },
      advanced: {
        focus: ["timing of overlap/underlap", "inside protection", "rest defence reading"]
      },
      performance: {
        focus: ["high-speed reliability", "side timing", "dual-role balance"]
      }
    },

    tacticalAdjustments: {
      build_up_heavy: {
        emphasis: ["support angle quality", "inside-versus-outside role reading"]
      },
      pressing_heavy: {
        emphasis: ["recovery speed", "isolated defending", "counterpressure connection"]
      },
      low_block_heavy: {
        emphasis: ["cross prevention", "back-post control", "inside-lane discipline"]
      }
    }
  },

  wing_back: {
    id: "wing_back",
    label: "Wing Back",
    line: "defence",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Provide width, depth and repeated side impact in both directions.",
      "Stretch the game in possession and reconnect quickly in defensive moments.",
      "Add high attacking value without losing side responsibility."
    ],

    roleTensions: [
      "High positioning versus recovery load.",
      "Width versus timing inside the final third.",
      "Attacking aggression versus defensive reconnect speed.",
      "Repeated involvement versus action quality."
    ],

    gamePhases: {
      inPossession: [
        "Stretch the side with width and depth.",
        "Recognise when to receive to feet, run beyond or come inside.",
        "Support entry and final-third actions with timing and clarity."
      ],
      outOfPossession: [
        "Reconnect to the line and manage side references.",
        "Control winger/full-back relations on the side.",
        "Protect the outside while staying linked to the back line."
      ],
      offensiveTransition: [
        "Exploit open side grass aggressively when the picture is real.",
        "Recognise whether the moment needs a direct run or a supporting position."
      ],
      defensiveTransition: [
        "Recover early with side and inside references.",
        "Protect the channel and back line from exposure.",
        "Delay when direct regain is unrealistic."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans side-space, last line, support relations and recovery risk.",
        "Reads whether width, underlap or depth is the best next action.",
        "Recognises rest-defence weakness before advancing."
      ],
      decisionMaking: [
        "Chooses between support, overlap, run behind or hold.",
        "Recognises when structure matters more than one more attacking action.",
        "Decides recovery line early after loss."
      ],
      execution: [
        "Delivers repeated dynamic runs with control.",
        "Executes final-third actions with composure.",
        "Recovers with direction, not only speed."
      ],
      communication: [
        "Coordinates with outside centre-back, wide attacker and midfielder."
      ],
      emotionalControl: [
        "Maintains action quality despite repeated high-intensity actions."
      ]
    },

    successBehaviours: [
      "Creates width and depth with timing.",
      "Adds real side threat.",
      "Recovers fast and intelligently after loss.",
      "Keeps structure despite high involvement.",
      "Makes repeated actions without losing clarity."
    ],

    commonBreakdowns: [
      "Moves high too often without relation to balance.",
      "Receives high but without next action quality.",
      "Creates final-third arrival without end product.",
      "Recovers late or on the wrong line.",
      "Behaves as a winger without defensive reconnection."
    ],

    riskPatterns: [
      "Overrunning the structure.",
      "Action volume masking poor decision quality.",
      "Recovery based on effort only, not picture.",
      "Final-third impatience after long run-up actions."
    ],

    diagnosticCues: [
      "Does he create useful width or only occupation?",
      "How often does his forward action hurt transition security?",
      "Is his recovery intelligent or merely intense?",
      "Do repeated actions stay clean late in sequences?",
      "How well does he reconnect to the line?"
    ],

    developmentDirections: [
      "Improve decision quality in high wide spaces.",
      "Sharpen recovery behaviour after ball loss.",
      "Improve end-product from advanced side actions.",
      "Recognise earlier when holding is the better contribution.",
      "Strengthen line reconnection after attacking phases."
    ],

    interventionDirections: {
      individual: [
        "Train high wide receptions with immediate next-picture choices.",
        "Use repeated run-recover-reorganise sequences.",
        "Train final-third composure after long runs."
      ],
      tactical: [
        "Clarify when wing-back goes high and who secures behind.",
        "Define recovery line references after loss."
      ],
      coaching: [
        "Coach timing and effect, not only running output.",
        "Link every advanced action to the cost of transition exposure."
      ],
      review: [
        "Review actions in full sequences: run, receive, final action, recovery."
      ]
    },

    coachingLanguage: [
      "Stretch with timing.",
      "Attack space with purpose.",
      "Your run must help the structure.",
      "Recover on the right line.",
      "Arrive high with calm."
    ],

    observationPrompts: [
      "Does the wing-back create width that matters?",
      "What happens after his own attacking action?",
      "How much value comes from his advanced receptions?",
      "Does he know when not to go?",
      "How well does he reconnect defensively?"
    ],

    planAngles: [
      "High-width behaviour",
      "Recovery after advanced positioning",
      "Final-third action quality",
      "Timing of forward runs",
      "Reconnection to defensive line"
    ],

    contextAdjustments: {
      academy: {
        emphasis: ["simple width-depth timing", "recovery line", "final action basics"]
      },
      first_team: {
        emphasis: ["repeatability", "transition discipline", "final-third efficiency"]
      },
      elite_schedule: {
        emphasis: ["running economy", "choice discipline", "late-phase execution quality"],
        warning: ["Do not overload with high-volume role demands without clarity."]
      },
      universal: {
        emphasis: ["timing", "transition discipline", "wide threat"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["basic width", "basic recovery", "simple final action"]
      },
      advanced: {
        focus: ["role timing", "recovery intelligence", "support variety"]
      },
      performance: {
        focus: ["repeatable high impact", "fatigue-resistant decision quality"]
      }
    },

    tacticalAdjustments: {
      transition_heavy: {
        emphasis: ["open-space attack", "fast recovery", "direct contribution"]
      },
      positional_play_heavy: {
        emphasis: ["width discipline", "timed depth", "support relations"]
      },
      pressing_heavy: {
        emphasis: ["reconnect speed", "counterpressure link", "wide-line recovery"]
      }
    }
  },

  defensive_midfielder: {
    id: "defensive_midfielder",
    label: "Defensive Midfielder",
    line: "midfield",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Connect structure, progression and central defensive stability.",
      "Make the game playable for the team under pressure.",
      "Protect central danger while enabling forward play."
    ],

    roleTensions: [
      "Security versus progression.",
      "Helping build-up versus protecting rest defence.",
      "Screening versus stepping.",
      "Tempo control versus forward acceleration."
    ],

    gamePhases: {
      inPossession: [
        "Offer central access under pressure.",
        "Support progression through orientation, bounce play, turn or switch.",
        "Stabilise the game around the ball.",
        "Make the next player’s action cleaner."
      ],
      outOfPossession: [
        "Protect central lanes and access to the 10-space.",
        "Recognise whether to screen, track, jump or cover.",
        "Support compactness in front of the back line."
      ],
      offensiveTransition: [
        "Secure the centre while supporting the next attacking action.",
        "Recognise when one-touch progression is on and when rest control matters more."
      ],
      defensiveTransition: [
        "React immediately to central threat.",
        "Delay counters through positioning and lane protection.",
        "Restore order in front of the defence."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans before receiving, while moving and after release.",
        "Reads pressure, cover shadow, line gaps and central exits.",
        "Recognises relation between own action and team stability."
      ],
      decisionMaking: [
        "Chooses whether to turn, set, play forward, switch or secure.",
        "Recognises when progression is real rather than hopeful.",
        "Decides whether to protect space or attack pressure."
      ],
      execution: [
        "Receives on angles that preserve continuation.",
        "Passes with tempo that serves the next picture.",
        "Moves subtly but effectively to stay available."
      ],
      communication: [
        "Supports central organisation through concise cues."
      ],
      emotionalControl: [
        "Stays available after being pressed out once.",
        "Does not hide when central pressure increases."
      ]
    },

    successBehaviours: [
      "Appears where the game needs stability.",
      "Looks calm under central pressure.",
      "Progresses without losing structure.",
      "Protects the centre early.",
      "Improves team rhythm."
    ],

    commonBreakdowns: [
      "Hides behind pressure or arrives too late.",
      "Receives square and kills continuation.",
      "Circulates safely without improving the picture.",
      "Jumps to the ball and opens the centre behind.",
      "Defends reactively instead of structurally."
    ],

    riskPatterns: [
      "Safety without influence.",
      "Progression ambition without scanning.",
      "Overhelping build-up and leaving centre unprotected.",
      "Pressing the ball instead of managing central danger."
    ],

    diagnosticCues: [
      "Does he become available before the team needs him or after?",
      "What body shape does he receive with under pressure?",
      "Does his pass help the next player face forward?",
      "What happens centrally when the ball is lost?",
      "Is he controlling the centre or following events in it?"
    ],

    developmentDirections: [
      "Improve pre-scan and early central availability.",
      "Sharpen receiving orientation under pressure.",
      "Increase value in first and second action after receiving.",
      "Improve screen-versus-step timing.",
      "Strengthen transition protection in front of the line."
    ],

    interventionDirections: {
      individual: [
        "Train central receiving with live pressure cues.",
        "Repeat set-turn-switch choices from different body orientations.",
        "Use transition-restoration exercises from broken structure."
      ],
      tactical: [
        "Clarify the 6-position relation to centre-backs and 8s.",
        "Define when the 6 secures and when he may join progression higher."
      ],
      coaching: [
        "Coach usefulness of availability, not just number of touches.",
        "Use language around stabilise, open, connect and protect."
      ],
      review: [
        "Review body orientation before first touch.",
        "Tag actions by effect on team structure and next action."
      ]
    },

    coachingLanguage: [
      "Arrive to play forward.",
      "Open before the ball comes.",
      "Protect the centre first.",
      "Stabilise before you accelerate.",
      "Make the next action easier."
    ],

    observationPrompts: [
      "How early does he make himself available centrally?",
      "What does he do after receiving under pressure?",
      "Is he helping progression or only continuing possession?",
      "How well does he protect central danger after loss?",
      "Does he calm the game or disappear from it?"
    ],

    planAngles: [
      "Central availability",
      "Receiving orientation",
      "Progression versus stability",
      "Screening and central protection",
      "Transition control"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "basic scanning",
          "open body shape",
          "simple central protection"
        ]
      },
      first_team: {
        emphasis: [
          "decision speed under pressure",
          "structure control",
          "risk discipline"
        ]
      },
      elite_schedule: {
        emphasis: [
          "economy of movement",
          "repeatable clarity",
          "simple high-value decisions"
        ],
        warning: [
          "Avoid overloading with unnecessary roaming in congested schedules."
        ]
      },
      universal: {
        emphasis: ["availability", "structure", "central protection"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["scan", "open body", "simple bounce and protect"]
      },
      advanced: {
        focus: ["turn decisions", "pressure resistance", "screen-step timing"]
      },
      performance: {
        focus: ["repeatable central control", "tempo authority", "stress resistance"]
      }
    },

    tacticalAdjustments: {
      build_up_heavy: {
        emphasis: ["receiving under first pressure", "line connection", "switch quality"]
      },
      transition_heavy: {
        emphasis: ["rest-defence protection", "quick secure-or-release decisions"]
      },
      pressing_heavy: {
        emphasis: ["counterpressure positioning", "screening lanes after loss"]
      }
    }
  },

  central_midfielder: {
    id: "central_midfielder",
    label: "Central Midfielder",
    line: "midfield",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Connect lines through movement, support and progression.",
      "Influence game rhythm, territory and transition response.",
      "Link structure with forward intent."
    ],

    roleTensions: [
      "Freedom versus positional discipline.",
      "Supporting under the ball versus arriving beyond.",
      "Progression versus game control.",
      "Counterpressure versus recovery shape."
    ],

    gamePhases: {
      inPossession: [
        "Offer support between, around or beyond lines.",
        "Progress via carry, combination or line-breaking pass.",
        "Recognise whether the game needs tempo change or continuity."
      ],
      outOfPossession: [
        "Support midfield compactness and pressing timing.",
        "Track midfield runners and protect central spaces.",
        "Contribute without disconnecting the structure."
      ],
      offensiveTransition: [
        "Join attacks with timing and role clarity.",
        "Recognise the best support line in open moments.",
        "Create or exploit overloads around the ball."
      ],
      defensiveTransition: [
        "React immediately after loss.",
        "Choose between counterpressure, delay or recovery.",
        "Recover influence quickly in the central picture."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans around the ball and beyond first pressure.",
        "Reads line gaps, support angles and transition pictures.",
        "Recognises when the game can and should accelerate."
      ],
      decisionMaking: [
        "Chooses between connect, turn, carry, release or run beyond.",
        "Recognises the best relation to the 6, 10 and forward line.",
        "Balances freedom with game responsibility."
      ],
      execution: [
        "Receives dynamically with continuation.",
        "Carries with direction and timing.",
        "Executes linking actions with the right tempo."
      ],
      communication: [
        "Supports spacing and support structure with timely cues."
      ],
      emotionalControl: [
        "Keeps appearing after mistakes or heavy pressure phases."
      ]
    },

    successBehaviours: [
      "Appears in useful spaces repeatedly.",
      "Improves the next team action.",
      "Accelerates the game at the right moments.",
      "Reconnects quickly after transitions.",
      "Combines structure with forward purpose."
    ],

    commonBreakdowns: [
      "Moves a lot without becoming truly useful.",
      "Receives but does not improve the picture.",
      "Forces the game forward when control is needed.",
      "Arrives late in transition moments.",
      "Loses role clarity between spaces."
    ],

    riskPatterns: [
      "Activity without influence.",
      "Ball attraction without structural awareness.",
      "Progression hunting without relation to team spacing.",
      "Late transition reactions after high involvement."
    ],

    diagnosticCues: [
      "Does he appear where the game needs connection?",
      "What changes after he receives?",
      "Is his movement functional or only busy?",
      "How quickly does he recover influence after loss?",
      "Does he create rhythm or random variation?"
    ],

    developmentDirections: [
      "Improve timing of support movement.",
      "Sharpen action quality after receiving under pressure.",
      "Improve relation between connect and accelerate moments.",
      "Increase transition reaction speed and clarity.",
      "Strengthen role discipline without reducing initiative."
    ],

    interventionDirections: {
      individual: [
        "Train receive-decide sequences with variable surrounding pictures.",
        "Use movement-support exercises with hidden cues, not scripted cones only.",
        "Train transition recovery from advanced positions."
      ],
      tactical: [
        "Clarify relation to 6 and 10 in each build-up layer.",
        "Define when 8 joins beyond and when 8 secures under the ball."
      ],
      coaching: [
        "Coach usefulness of movement, not only movement volume.",
        "Use language around connect, appear, accelerate and recover."
      ],
      review: [
        "Review influence on next action, not just own action quality."
      ]
    },

    coachingLanguage: [
      "Arrive where the game needs you.",
      "Connect first, accelerate second.",
      "Be dynamic without becoming loose.",
      "Improve the next picture.",
      "Recover your influence fast."
    ],

    observationPrompts: [
      "How often does he become truly playable?",
      "What happens after he receives?",
      "Does he help the team connect or disconnect?",
      "When the game opens, does he recognise the right support line?",
      "How functional is his movement?"
    ],

    planAngles: [
      "Support timing",
      "Action after receiving",
      "Tempo control versus acceleration",
      "Transition reaction",
      "Role clarity in midfield"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "functional movement",
          "simple support angles",
          "basic transition reaction"
        ]
      },
      first_team: {
        emphasis: [
          "decision speed",
          "influence on game rhythm",
          "role discipline under pressure"
        ]
      },
      elite_schedule: {
        emphasis: [
          "movement economy",
          "clear support choices",
          "recovery efficiency"
        ]
      },
      universal: {
        emphasis: ["connection", "timing", "transition awareness"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["support angles", "simple continuation", "transition reaction"]
      },
      advanced: {
        focus: ["receive-turn-release choices", "movement timing", "rhythm influence"]
      },
      performance: {
        focus: ["repeatable influence", "stress-resistant timing", "game authority"]
      }
    },

    tacticalAdjustments: {
      positional_play_heavy: {
        emphasis: ["spacing discipline", "third-man support", "tempo control"]
      },
      transition_heavy: {
        emphasis: ["support lines in open field", "fast reconnect", "secure-or-join decisions"]
      },
      pressing_heavy: {
        emphasis: ["counterpressure", "recovery running", "compactness after jump"]
      }
    }
  },

  attacking_midfielder: {
    id: "attacking_midfielder",
    label: "Attacking Midfielder",
    line: "midfield",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Create attacking advantage between lines and near the box.",
      "Link progression to chance creation.",
      "Turn useful receptions into dangerous outcomes."
    ],

    roleTensions: [
      "Creativity versus clarity.",
      "Turning versus setting.",
      "Freedom versus role discipline.",
      "Risk-taking versus end-product efficiency."
    ],

    gamePhases: {
      inPossession: [
        "Find and exploit pockets between lines.",
        "Turn, combine or release in dangerous zones.",
        "Create momentum near the box without forcing chaos."
      ],
      outOfPossession: [
        "Support first line or central block with tactical discipline.",
        "Recognise pressing triggers without exposing midfield structure.",
        "Help control central access when the team is compact."
      ],
      offensiveTransition: [
        "Exploit unstable structures quickly.",
        "Recognise when to receive to feet, spin, carry or release runners."
      ],
      defensiveTransition: [
        "React early after loss near the ball.",
        "Counterpress or recover central access depending on the picture."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans line gaps, defender orientation, runner pictures and box occupation.",
        "Reads whether the advantage is in turn, set, carry or release.",
        "Recognises time and pressure before the reception."
      ],
      decisionMaking: [
        "Chooses the highest-value next action near dangerous zones.",
        "Recognises when a simple action keeps a stronger attack alive.",
        "Balances invention with game truth."
      ],
      execution: [
        "Receives and turns cleanly in tight areas.",
        "Executes final pass, carry or shot with precision and timing.",
        "Acts quickly without rushing."
      ],
      communication: [
        "Supports short attacking combinations around the box."
      ],
      emotionalControl: [
        "Keeps clarity when space and time reduce."
      ]
    },

    successBehaviours: [
      "Gets playable in the right pockets.",
      "Turns reception into advantage.",
      "Creates danger through clarity.",
      "Links midfield progression to final-third output.",
      "Makes good actions at game speed."
    ],

    commonBreakdowns: [
      "Occupies pockets without becoming truly playable.",
      "Turns when the game asks for set play.",
      "Searches difficult action too early.",
      "Disappears when pressure intensifies.",
      "Creates touches rather than danger."
    ],

    riskPatterns: [
      "Flair without game truth.",
      "High-risk choices in medium-value moments.",
      "Role drift away from useful pockets.",
      "Late reaction after loss in central attacking zones."
    ],

    diagnosticCues: [
      "How often is he truly playable between lines?",
      "What does he do with the first useful reception?",
      "Does he create danger or simply involvement?",
      "How often does he choose the difficult action too early?",
      "How active is he after the ball is lost?"
    ],

    developmentDirections: [
      "Improve scanning before receiving between lines.",
      "Sharpen turn-set-carry-release decisions in tight spaces.",
      "Increase final-third output from quality receptions.",
      "Improve relation to striker and wide players.",
      "Strengthen reaction after loss in central attacking zones."
    ],

    interventionDirections: {
      individual: [
        "Train between-line receptions with live defender orientation.",
        "Use tight-space decision games around turn-set-release choices.",
        "Repeat final-third choices from different body positions."
      ],
      tactical: [
        "Clarify pocket occupation relative to striker and winger movement.",
        "Define rest behaviour after central attacking involvement."
      ],
      coaching: [
        "Coach value creation, not only creative intent.",
        "Use language around danger, clarity, timing and next advantage."
      ],
      review: [
        "Review useful receptions and the next action quality.",
        "Separate boldness from actual value."
      ]
    },

    coachingLanguage: [
      "Arrive between lines with purpose.",
      "Turn only if the picture is there.",
      "Create danger, not just touches.",
      "Play the next advantage.",
      "Be clean near the box."
    ],

    observationPrompts: [
      "How often does he become truly playable?",
      "What happens after he receives in tight central space?",
      "Is he increasing danger or only possession involvement?",
      "How good is his relation to runners and striker?",
      "How does he react after loss?"
    ],

    planAngles: [
      "Receiving between lines",
      "Tight-space decisions",
      "Final-third output",
      "Connection to runners",
      "Reaction after loss"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "basic pocket timing",
          "clear first action",
          "simple danger creation"
        ],
        warning: [
          "Do not reward unnecessary complexity too early."
        ]
      },
      first_team: {
        emphasis: [
          "end-product efficiency",
          "speed of action",
          "clarity in small spaces"
        ]
      },
      elite_schedule: {
        emphasis: [
          "fast simple value creation",
          "energy-efficient positioning",
          "reaction after loss"
        ]
      },
      universal: {
        emphasis: ["danger creation", "pocket timing", "clarity near box"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["playable pockets", "simple set or turn", "basic final action"]
      },
      advanced: {
        focus: ["tight-space choices", "runner relations", "box-proximate decisions"]
      },
      performance: {
        focus: ["high-speed clarity", "output from few moments", "pressure resistance"]
      }
    },

    tacticalAdjustments: {
      positional_play_heavy: {
        emphasis: ["pocket discipline", "third-man links", "small-space speed"]
      },
      transition_heavy: {
        emphasis: ["direct advantage exploitation", "run release timing", "carry-or-pass clarity"]
      },
      pressing_heavy: {
        emphasis: ["reaction after loss", "counterpressure proximity", "central access protection"]
      }
    }
  },

  winger: {
    id: "winger",
    label: "Winger",
    line: "attack",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Create width, depth and attacking advantage from the side.",
      "Threaten the back line through timing, 1v1 quality and end product.",
      "Support pressing and transition moments from wide positions."
    ],

    roleTensions: [
      "Width versus inside threat.",
      "1v1 aggression versus game timing.",
      "Ball demand versus team spacing.",
      "Directness versus end-product clarity."
    ],

    gamePhases: {
      inPossession: [
        "Stretch or attack from wide positions with timing.",
        "Recognise when to isolate, combine, come inside or run behind.",
        "Turn receptions into threat rather than possession only."
      ],
      outOfPossession: [
        "Support pressing shape and side access control.",
        "Track or screen according to structure.",
        "Recover with discipline when the side becomes exposed."
      ],
      offensiveTransition: [
        "Exploit open grass quickly and intelligently.",
        "Recognise when directness is on and when support is stronger."
      ],
      defensiveTransition: [
        "React immediately after loss near the side.",
        "Counterpress or recover line depending on the moment.",
        "Protect easy exits for the opponent."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans full-back distance, cover position, inside support and space behind.",
        "Reads whether the duel is truly on or needs preparation.",
        "Recognises where the box picture is before the final action."
      ],
      decisionMaking: [
        "Chooses between direct attack, combination, cut-in or run behind.",
        "Recognises when to hold width and when to collapse space inside.",
        "Makes final-third choices in relation to box occupation."
      ],
      execution: [
        "Receives dynamically with continuation.",
        "Executes 1v1 actions with conviction and timing.",
        "Delivers final action with clarity."
      ],
      communication: [
        "Coordinates with full-back/wing-back and attacking midfielder."
      ],
      emotionalControl: [
        "Keeps attacking courage after failed duels."
      ]
    },

    successBehaviours: [
      "Turns wide receptions into real threat.",
      "Chooses the duel at the right time.",
      "Preserves width long enough to create value.",
      "Adds end product from advantage moments.",
      "Supports the team in defensive transitions."
    ],

    commonBreakdowns: [
      "Receives static and kills threat.",
      "Forces the 1v1 without the picture.",
      "Comes inside too early and removes width.",
      "Creates action without end product.",
      "Switches off after loss."
    ],

    riskPatterns: [
      "Volume of dribbles over quality of moments.",
      "Ball hunger that hurts team spacing.",
      "Inside drift without tactical reason.",
      "End-product rushed after winning the first action."
    ],

    diagnosticCues: [
      "Does the winger create real threat from receptions?",
      "When he attacks 1v1, was the duel actually ready?",
      "How long does he preserve width?",
      "What is the quality of the final action after advantage?",
      "How reliable is he after possession loss?"
    ],

    developmentDirections: [
      "Improve receiving quality before 1v1 actions.",
      "Sharpen duel selection and timing.",
      "Increase end-product after advantage moments.",
      "Improve width-versus-inside role reading.",
      "Strengthen defensive transition discipline."
    ],

    interventionDirections: {
      individual: [
        "Train first touch into threat from wide receptions.",
        "Use duel exercises with manipulated help defenders and support cues.",
        "Train end product after winning the first action."
      ],
      tactical: [
        "Clarify width ownership with full-back/wing-back.",
        "Define when winger pins width and when winger may arrive inside."
      ],
      coaching: [
        "Coach danger creation, not just bravery in duels.",
        "Use language around ready duel, width value and end product."
      ],
      review: [
        "Review whether the winger attacked the right duel, not only if he beat it."
      ]
    },

    coachingLanguage: [
      "Be dangerous from the first touch.",
      "Attack when the duel is real.",
      "Hold width until the picture changes.",
      "Create end product from advantage.",
      "React immediately after loss."
    ],

    observationPrompts: [
      "How often does the winger turn receptions into threat?",
      "When does he choose the duel and is that timing good?",
      "Does he preserve the team’s width long enough?",
      "What is the level of his final action?",
      "How does he behave after losing the ball?"
    ],

    planAngles: [
      "Wide receiving before 1v1",
      "Duel selection and timing",
      "End product",
      "Width versus inside movement",
      "Defensive transition"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "first touch into threat",
          "basic width discipline",
          "simple final action"
        ]
      },
      first_team: {
        emphasis: [
          "duel timing",
          "final-third efficiency",
          "transition discipline"
        ]
      },
      elite_schedule: {
        emphasis: [
          "high-value actions over action volume",
          "recovery discipline",
          "energy-efficient positioning"
        ]
      },
      universal: {
        emphasis: ["threat", "timing", "end product"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["receive and attack", "basic width", "simple final action"]
      },
      advanced: {
        focus: ["duel choice", "inside-versus-outside timing", "end-product quality"]
      },
      performance: {
        focus: ["few touches, high value", "repeatable danger", "defensive reliability"]
      }
    },

    tacticalAdjustments: {
      transition_heavy: {
        emphasis: ["open-space running", "direct threat", "fast end product"]
      },
      positional_play_heavy: {
        emphasis: ["width discipline", "isolations", "timed inside arrival"]
      },
      pressing_heavy: {
        emphasis: ["side counterpressure", "recovery after loss", "blocking easy exits"]
      }
    }
  },

  striker: {
    id: "striker",
    label: "Striker",
    line: "attack",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Threaten the last line and convert attacking moments into danger.",
      "Give the team depth, occupation and box presence.",
      "Lead or support the first defensive pressure from the front."
    ],

    roleTensions: [
      "Depth threat versus link play.",
      "Box presence versus support underneath.",
      "Self-threat versus creating space for others.",
      "Pressing aggression versus structural discipline."
    ],

    gamePhases: {
      inPossession: [
        "Stretch or pin the last line.",
        "Recognise when to come short, spin, occupy or attack the box.",
        "Create value through movement, timing and first contact."
      ],
      outOfPossession: [
        "Support first pressure line through body shape and timing.",
        "Screen, jump or direct build-up according to team structure.",
        "Set the tone of front pressure without random running."
      ],
      offensiveTransition: [
        "Attack space behind quickly when open.",
        "Recognise when first contact is needed over pure depth.",
        "Turn unstable moments into immediate threat."
      ],
      defensiveTransition: [
        "React after loss near the ball.",
        "Delay central exits or support first counterpressure action."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans centre-backs, line height, support underneath and box picture.",
        "Reads when depth is on and when connection is better.",
        "Recognises passing window before it fully opens."
      ],
      decisionMaking: [
        "Chooses whether to pin, move, set, spin or attack zone.",
        "Recognises when to stay high and when to connect.",
        "Selects runs that create value for self or others."
      ],
      execution: [
        "Times runs effectively against the line.",
        "Protects or sets the ball under pressure when needed.",
        "Finishes or creates final actions decisively."
      ],
      communication: [
        "Supports front-pressure coordination."
      ],
      emotionalControl: [
        "Keeps threat behaviour even when touches are limited.",
        "Does not force involvement out of frustration."
      ]
    },

    successBehaviours: [
      "Threatens the line with intent.",
      "Occupies centre-backs usefully.",
      "Connects when needed without losing depth.",
      "Arrives in the box at the right time.",
      "Creates large value from few moments."
    ],

    commonBreakdowns: [
      "Moves a lot without threatening the line.",
      "Comes short too often and empties the box.",
      "Runs late against the last line.",
      "Disconnects from midfield relation.",
      "Needs too many touches for one dangerous action."
    ],

    riskPatterns: [
      "Touch hunger over line threat.",
      "Depth running without relation to passer picture.",
      "Box occupation too early or too late.",
      "Pressing effort without tactical effect."
    ],

    diagnosticCues: [
      "Does he really threaten the last line?",
      "When he comes short, does it improve the attack?",
      "How does he occupy the box before the final pass or cross?",
      "What is the value of his first contact under pressure?",
      "How effective is his first defensive pressure?"
    ],

    developmentDirections: [
      "Improve timing of movement against the last line.",
      "Sharpen relation between connect and threaten moments.",
      "Increase value in first contact under pressure.",
      "Improve box occupation and arrival timing.",
      "Strengthen first-pressure behaviour from the front."
    ],

    interventionDirections: {
      individual: [
        "Train run timing off delayed and disguised passing cues.",
        "Repeat first-contact actions under physical pressure.",
        "Use box-arrival exercises linked to real crossing pictures."
      ],
      tactical: [
        "Clarify when striker stays high and when striker may connect.",
        "Define front-pressure references and body-shape tasks."
      ],
      coaching: [
        "Coach threat value, not only touch count.",
        "Use language around pin, threaten, connect and arrive."
      ],
      review: [
        "Review movement in relation to passer picture and box timing."
      ]
    },

    coachingLanguage: [
      "Threaten the line first.",
      "Connect without losing depth.",
      "Arrive before the gap is obvious.",
      "Occupy with intent.",
      "Turn few moments into big value."
    ],

    observationPrompts: [
      "How much real threat does the striker create against the line?",
      "When he comes short, is it useful?",
      "How does he behave in the box?",
      "What is the level of his first contact under pressure?",
      "How effective is his front pressure?"
    ],

    planAngles: [
      "Depth timing",
      "Link play versus line threat",
      "First contact under pressure",
      "Box occupation",
      "Front-pressure behaviour"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "line threat basics",
          "simple connect-or-go decisions",
          "box arrival timing"
        ]
      },
      first_team: {
        emphasis: [
          "efficiency from few moments",
          "high-speed movement timing",
          "front-pressure clarity"
        ]
      },
      elite_schedule: {
        emphasis: [
          "movement economy",
          "high-value actions",
          "stable pressure cues"
        ]
      },
      universal: {
        emphasis: ["threat", "occupation", "efficiency"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["basic line runs", "simple support", "box arrival"]
      },
      advanced: {
        focus: ["connect-versus-threat decisions", "first contact", "run timing"]
      },
      performance: {
        focus: ["efficiency", "repeatable threat", "pressure leadership"]
      }
    },

    tacticalAdjustments: {
      transition_heavy: {
        emphasis: ["space behind", "first-run timing", "direct threat"]
      },
      positional_play_heavy: {
        emphasis: ["pinning line", "box occupation", "connective set actions"]
      },
      pressing_heavy: {
        emphasis: ["front-screening", "jump timing", "directing build-up"]
      }
    }
  },

  second_striker: {
    id: "second_striker",
    label: "Second Striker",
    line: "attack",
    contexts: ["academy", "first_team", "elite_schedule", "universal"],

    rolePurpose: [
      "Connect striker presence with pocket occupation and secondary threat.",
      "Exploit spaces created by the striker or wide attackers.",
      "Add unpredictability, combination quality and rebound presence."
    ],

    roleTensions: [
      "Support versus own threat.",
      "Pocket occupation versus striker-space collision.",
      "Freedom versus role clarity.",
      "Link play versus direct box arrival."
    ],

    gamePhases: {
      inPossession: [
        "Find supporting pockets around the striker and midfield line.",
        "Combine, turn or arrive beyond the striker.",
        "Create instability between defenders and holding midfielders."
      ],
      outOfPossession: [
        "Support front shape and central blocking tasks.",
        "Help connect attacking and midfield pressure.",
        "Recognise when to screen and when to jump."
      ],
      offensiveTransition: [
        "Arrive into unstable pockets around the first break.",
        "Choose between underneath support and secondary depth."
      ],
      defensiveTransition: [
        "Counterpress central space quickly.",
        "Recover access around the ball when immediate regain is not possible."
      ]
    },

    behaviouralDemands: {
      perception: [
        "Scans striker movement, midfield gaps and second-ball pictures.",
        "Reads when defenders are occupied enough for his own reception.",
        "Recognises the next useful pocket before it is obvious."
      ],
      decisionMaking: [
        "Chooses when to support, combine, arrive or threaten depth.",
        "Recognises best relation to striker in each moment.",
        "Acts quickly in crowded central zones."
      ],
      execution: [
        "Receives and turns cleanly in tight spaces.",
        "Combines at game speed near the box.",
        "Finishes secondary moments decisively."
      ],
      communication: [
        "Supports relation with striker, winger and attacking midfielder."
      ],
      emotionalControl: [
        "Maintains role clarity despite hybrid demands."
      ]
    },

    successBehaviours: [
      "Finds useful supporting pockets.",
      "Adds overload or confusion centrally.",
      "Supports striker without blocking him.",
      "Acts quickly in small spaces.",
      "Provides real secondary threat."
    ],

    commonBreakdowns: [
      "Occupies the same space as the striker.",
      "Receives in pockets but releases danger backwards too often.",
      "Arrives late for rebounds and second actions.",
      "Floats without clear role relation.",
      "Supports but does not threaten."
    ],

    riskPatterns: [
      "Hybrid role becoming vague role.",
      "Pocket occupation without acceleration after reception.",
      "Too much attraction to ball-side space.",
      "Secondary runs with poor timing."
    ],

    diagnosticCues: [
      "How well does he play off the striker?",
      "Does he arrive in useful pockets or just nearby space?",
      "What happens after he receives near the box?",
      "Is he adding second-line danger?",
      "How clear is his role without the ball?"
    ],

    developmentDirections: [
      "Improve role relation to the main striker.",
      "Sharpen action quality in pockets and around the box.",
      "Improve timing of secondary runs.",
      "Increase threat after combination moments.",
      "Clarify defensive role in front pressure and transition."
    ],

    interventionDirections: {
      individual: [
        "Train receive-combine-arrive sequences around the striker.",
        "Repeat secondary-run timing off rebounds and cutbacks.",
        "Use tight-space decisions with directional pressure."
      ],
      tactical: [
        "Clarify space ownership relative to striker and 10.",
        "Define first-pressure and recovery tasks."
      ],
      coaching: [
        "Coach relation and timing, not only freedom.",
        "Use language around support, threaten, arrive and connect."
      ],
      review: [
        "Review role relation to striker in full sequences."
      ]
    },

    coachingLanguage: [
      "Play off the striker, not into him.",
      "Support and threaten.",
      "Arrive where the line breaks.",
      "Be quick in tight space.",
      "Find the second action."
    ],

    observationPrompts: [
      "How well does he connect to the striker?",
      "Does he arrive in useful pockets?",
      "What happens after he receives near the box?",
      "How much second-line threat does he add?",
      "How clear is his role in transition?"
    ],

    planAngles: [
      "Relation to striker",
      "Pocket occupation",
      "Action after tight-space reception",
      "Secondary run timing",
      "Transition role clarity"
    ],

    contextAdjustments: {
      academy: {
        emphasis: [
          "clear relation to striker",
          "simple support pockets",
          "basic second action awareness"
        ]
      },
      first_team: {
        emphasis: [
          "tight-space speed",
          "secondary threat",
          "role clarity in hybrid moments"
        ]
      },
      elite_schedule: {
        emphasis: [
          "efficient movement",
          "high-value pocket use",
          "simple recovery tasks"
        ]
      },
      universal: {
        emphasis: ["relation", "timing", "secondary threat"]
      }
    },

    stageAdjustments: {
      foundation: {
        focus: ["support pockets", "simple combine", "second action awareness"]
      },
      advanced: {
        focus: ["hybrid role timing", "tight-space speed", "secondary runs"]
      },
      performance: {
        focus: ["high-speed role clarity", "efficient secondary threat", "pressure intelligence"]
      }
    },

    tacticalAdjustments: {
      positional_play_heavy: {
        emphasis: ["pocket discipline", "support-striker relation", "small-space combinations"]
      },
      transition_heavy: {
        emphasis: ["secondary arrivals", "support under first break", "direct threat after connection"]
      },
      pressing_heavy: {
        emphasis: ["central blocking", "front-shape connection", "counterpressure near loss"]
      }
    }
  }
} as const;

export const roleProfileGroups = {
  defensiveRoles: ["goalkeeper", "centre_back", "full_back", "wing_back"] as PlayerUnit[],
  midfieldRoles: [
    "defensive_midfielder",
    "central_midfielder",
    "attacking_midfielder",
  ] as PlayerUnit[],
  attackingRoles: ["winger", "striker", "second_striker"] as PlayerUnit[],
} as const;

export const roleAliases: Record<PlayerUnit, string[]> = {
  goalkeeper: ["goalkeeper", "keeper", "gk", "doelman"],
  centre_back: ["centre back", "center back", "cb", "lcv", "rcv", "centrale verdediger"],
  full_back: ["full back", "left back", "right back", "back", "rechtsback", "linksback"],
  wing_back: ["wing back", "lwb", "rwb", "wingback"],
  defensive_midfielder: ["6", "holding midfielder", "dm", "controlerende middenvelder"],
  central_midfielder: ["8", "cm", "central midfielder", "middenvelder"],
  attacking_midfielder: ["10", "am", "attacking midfielder", "aanvallende middenvelder"],
  winger: ["winger", "left winger", "right winger", "buiten", "flankspeler"],
  striker: ["striker", "9", "centre forward", "spits"],
  second_striker: ["second striker", "shadow striker", "ss", "schaduwspits"],
};

export function findRoleProfile(input?: string): RoleProfile | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase();

  for (const [role, aliases] of Object.entries(roleAliases) as [PlayerUnit, string[]][]) {
    if (aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return roleProfiles[role];
    }
  }

  return null;
}