"use client";

import Link from "next/link";
import { Video, Users, Sparkles, Activity, Shield, ArrowRight, Play, MessageSquareHeart, Zap, Globe, Lock, MessageCircle, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center relative overflow-hidden bg-background text-foreground selection:bg-primary/30">
      
      {/* Dynamic Grid & Lights Background (Optimized for Performance) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Grid - simplified mask for better performance */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,#000_20%,transparent_100%)]" />
        
        {/* Glowing Orbs - Replaced CSS blur() with faster radial-gradients */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.15)_0%,transparent_70%)] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] right-[-10%] w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)] rounded-full" 
        />
      </div>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24 relative z-10 flex flex-col lg:flex-row items-center gap-16 min-h-[85vh]">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 mb-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-foreground/90">Next-Gen WebRTC Platform</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter mb-6 leading-[1.1]"
          >
            Real-Time Streaming, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
              Zero Latency.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light"
          >
            Deliver <span className="text-foreground font-medium">sub-second</span> video, interactive reactions, 
            and real-time chat straight from your browser.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link 
              href="/dashboard/creator"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(157,78,221,0.3)] flex items-center gap-2"
            >
              <Video className="w-5 h-5" /> Start Broadcasting
            </Link>
            <Link 
              href="/discover"
              className="px-8 py-4 rounded-full bg-transparent border-2 border-foreground/20 text-foreground font-bold hover:bg-foreground/5 transition-all flex items-center gap-2"
            >
              Explore Directory <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Visual Elements */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square max-w-2xl"
        >
          {/* Main Mockup Card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-600/20 rounded-[3rem] blur-2xl opacity-50" />
          <div className="absolute inset-4 bg-card border border-foreground/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
            {/* Fake Streamer Video Area */}
            <div className="flex-1 bg-secondary relative flex items-center justify-center border-b border-foreground/5 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1561344640-2453889cde5b?q=80&w=800&auto=format&fit=crop" alt="Streamer" className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-red-500/10 border border-red-500/30 backdrop-blur-md text-red-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" /> LIVE
              </div>
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-foreground/10">
                <Users className="w-3 h-3 text-blue-400" /> 1.2k
              </div>
            </div>
            {/* Fake Chat Area */}
            <div className="h-32 bg-background p-4 flex flex-col justify-end gap-2 text-sm">
              <div className="flex gap-2 items-center text-foreground/60"><span className="font-bold text-primary">User123</span> This looks incredible!</div>
              <div className="flex gap-2 items-center text-foreground/60"><span className="font-bold text-blue-400">StreamFan</span> WebRTC is so fast!</div>
              <div className="flex gap-2 items-center text-foreground/60"><span className="font-bold text-pink-400">Moderator</span> Welcome to the stream!</div>
            </div>
          </div>

          {/* Floating UI Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-1/4 bg-secondary border border-foreground/10 p-4 rounded-2xl shadow-2xl items-center gap-3 backdrop-blur-xl z-20 flex"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">Latency</p>
              <p className="text-sm font-bold text-emerald-400">0.2s</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-6 bottom-1/4 bg-secondary border border-foreground/10 p-4 rounded-2xl shadow-2xl items-center gap-3 backdrop-blur-xl z-20 flex"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/50">New Reaction</p>
              <p className="text-sm font-bold text-foreground">"Awesome! 🔥"</p>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Modern Feature Grid Section */}
      <section className="w-full bg-card border-t border-foreground/5 py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the <span className="text-primary">Next Generation</span></h2>
            <p className="text-foreground/50 text-lg max-w-2xl mx-auto">We ripped out the legacy protocols and built StreamPulse on pure WebRTC and modern web technologies to deliver an unparalleled experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Zero Latency WebRTC", desc: "Say goodbye to 15-second stream delays. Our LiveKit integration ensures sub-second glass-to-glass latency.", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "group-hover:border-yellow-400/50" },
              { icon: MessageSquareHeart, title: "Real-Time Data Channels", desc: "Chat and floating reactions sync perfectly with the video frame using highly optimized WebRTC data channels.", color: "text-pink-400", bg: "bg-pink-400/10", border: "group-hover:border-pink-400/50" },
              { icon: Globe, title: "Global Edge Network", desc: "Broadcasting and consuming video is automatically routed to the closest edge server globally.", color: "text-blue-400", bg: "bg-blue-400/10", border: "group-hover:border-blue-400/50" },
              { icon: Shield, title: "Secure & Authenticated", desc: "NextAuth ensures that only authorized creators can broadcast, while viewers enjoy a safe environment.", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "group-hover:border-emerald-400/50" },
              { icon: Activity, title: "Live Telemetry", desc: "Monitor your stream health, bitrate, and viewer count in real-time right from your Creator Studio.", color: "text-purple-400", bg: "bg-purple-400/10", border: "group-hover:border-purple-400/50" },
              { icon: Lock, title: "Robust Architecture", desc: "Our serverless PostgreSQL database handles instant scaling, ensuring your stream metadata and user states are lightning-fast and secure.", color: "text-foreground/80", bg: "bg-foreground/10", border: "group-hover:border-foreground/50" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group relative bg-background border border-foreground/10 rounded-3xl p-8 hover:bg-secondary transition-all duration-500 ${feature.border}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32 relative z-10 overflow-hidden bg-background border-t border-foreground/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(157,78,221,0.2)_0%,transparent_70%)] pointer-events-none blur-2xl" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-foreground/5 border border-foreground/10 mb-8 backdrop-blur-xl shadow-2xl">
               <Video className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
              Ready to go <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">live?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-foreground/50 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join the next generation of streamers. Your community is waiting. Setup takes less than 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md mx-auto">
              <Link 
                href="/login" 
                className="flex-1 group relative flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all"
              >
                <div className="absolute inset-0 rounded-full bg-white blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-foreground/40">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Go live in 60 seconds</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Zero latency guarantee</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-foreground/5 bg-secondary/30 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(157,78,221,0.5)]" />
                <span className="font-bold text-2xl text-foreground tracking-tight">StreamPulse</span>
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed max-w-xs mb-8">
                The next-generation live streaming platform. Zero latency, interactive experiences, and robust serverless architecture.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-background border border-foreground/10 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-background border border-foreground/10 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/50 transition-colors">
                  <Code className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><Link href="/discover" className="hover:text-primary transition-colors">Discover Streams</Link></li>
                <li><Link href="/dashboard/creator" className="hover:text-primary transition-colors">Creator Studio</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">LiveKit Integration</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-foreground/50">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/40">
            <p>© {new Date().getFullYear()} StreamPulse Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
