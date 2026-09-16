<div align="center">

<svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="42" rx="24" ry="26" fill="#f5e6d8" />
  <ellipse cx="50" cy="23" rx="22" ry="12" fill="#c8c8c8" />
  <path d="M28 28 Q22 18 30 14 Q36 10 40 16" stroke="#8b1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M72 28 Q78 18 70 14 Q64 10 60 16" stroke="#8b1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M34 16 Q40 8 50 10 Q60 8 66 16" stroke="#8b1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="14" rx="10" ry="7" fill="#c8c8c8" />
  <path d="M44 12 Q50 8 56 12" stroke="#8b1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="26" cy="44" rx="4" ry="5" fill="#f0d8c8" />
  <ellipse cx="74" cy="44" rx="4" ry="5" fill="#f0d8c8" />
  <circle cx="26" cy="50" r="2.5" fill="#8b1a1a" />
  <circle cx="74" cy="50" r="2.5" fill="#8b1a1a" />
  <circle cx="41" cy="43" r="9" stroke="#1a1a1a" stroke-width="2.2" fill="rgba(200,220,255,0.15)" />
  <circle cx="59" cy="43" r="9" stroke="#1a1a1a" stroke-width="2.2" fill="rgba(200,220,255,0.15)" />
  <line x1="50" y1="42" x2="50" y2="44" stroke="#1a1a1a" stroke-width="1.8" />
  <path d="M34 36 Q41 33 47 35" stroke="#7a6060" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M53 35 Q59 33 66 36" stroke="#7a6060" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M42 56 Q50 63 58 56" stroke="#8b1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M44 58 Q50 62 56 58" fill="#8b1a1a" opacity="0.6" />
  <path d="M48 49 Q50 54 52 49" stroke="#c09080" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M26 82 Q30 68 50 66 Q70 68 74 82 L80 100 L20 100 Z" fill="#8b1a1a" />
  <path d="M36 68 Q50 75 64 68" stroke="#d4a017" stroke-width="1" fill="none"/>
  <circle cx="38.43" cy="72.64" r="2.2" fill="#d4a017" />
  <circle cx="41.00" cy="71.94" r="2.2" fill="#d4a017" />
  <circle cx="43.84" cy="71.42" r="2.2" fill="#d4a017" />
  <circle cx="46.87" cy="71.11" r="2.2" fill="#d4a017" />
  <circle cx="50.00" cy="71.00" r="2.2" fill="#d4a017" />
  <circle cx="53.13" cy="71.11" r="2.2" fill="#d4a017" />
  <circle cx="56.16" cy="71.42" r="2.2" fill="#d4a017" />
  <circle cx="59.00" cy="71.94" r="2.2" fill="#d4a017" />
  <circle cx="61.57" cy="72.64" r="2.2" fill="#d4a017" />
</svg>

# MOM-OS
### Mind-Oriented Machine Operating System

![License](https://img.shields.io/badge/license-MIT-green)
![Kernel](https://img.shields.io/badge/kernel-6.8%20LTS-blue)
![Linux](https://img.shields.io/badge/Linux-supported-orange)
![Windows](https://img.shields.io/badge/Windows-compatible-0078d4)
![Ubuntu](https://img.shields.io/badge/Ubuntu-tested-E95420)
![AI](https://img.shields.io/badge/AI-powered-purple)
![Mom.OS](https://img.shields.io/badge/Mom.OS-v1.0.0-9cf)

</div>

---

## What this is

Most operating systems make you think in terms of programs. You want something done, so you figure out which app does it, open it, click around, move some files, close it, open the next thing. MOM-OS is an attempt to flip that: you say what you want, and something underneath figures out which programs, files, or tools are actually needed to get there.

To be clear about what that means in practice — this isn't a new kernel, and it isn't a chatbot stapled onto a terminal. It's an agent layer that sits on top of a normal Linux system and takes on the job of translating "what you want" into "what needs to run."

## Why bother

Because that translation step — goal → sequence of clicks — doesn't actually need a human doing it every time. It's just overhead the OS pushes onto you because it only understands processes, not purposes. If that layer can be automated safely, computers get a lot less annoying to use.

## What's actually being built right now

This is early. Like, "sketching the idea on paper" early. The plan for v0:

- [ ] Figure out what an "intent" even looks like as a data structure the OS can act on
- [ ] Build a small agent daemon on top of regular Linux (no custom kernel)
- [ ] A permission model so the agent can't just do whatever it wants unsupervised
- [ ] A bare-bones shell/UI to actually talk to it
- [ ] Keep inference local by default — no forced cloud dependency

Not doing (yet): writing a kernel from scratch, multi-machine/distributed anything, mobile. Those might come later, but trying to do them now would mean never shipping anything.

## Rough architecture

```
┌─────────────────────────────┐
│  Intent layer                │  you describe a goal
├─────────────────────────────┤
│  Agent orchestrator          │  decides what tools/programs/files
│                               │  are needed, and in what order
├─────────────────────────────┤
│  Regular Linux kernel        │  process, memory, drivers, fs
│  (untouched, for now)        │
└─────────────────────────────┘
```

The orchestrator is the actual new part. Everything below it is deliberately boring and unmodified until the idea above it is proven out.

## What this isn't

- Not a new kernel, not claiming to be
- Not distributed / multi-device — single machine only for now
- Not just an LLM wrapper with extra steps

Saying this upfront on purpose — "AI OS" projects tend to promise everything and deliver a demo. Better to be honest about scope than to oversell it.

## Status

Pre-alpha. Right now this repo is just the idea and the design sketch — no code published yet.

## Contributing

Not really open for contributions yet since the design itself is still moving around. If you've got thoughts, prior art, or want to poke holes in the idea, open an issue — that's genuinely useful right now.

## License

MIT — see [LICENSE](./LICENSE).
