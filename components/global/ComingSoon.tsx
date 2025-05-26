"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Type definitions
interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
}

export default function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 15,
        hours: 8,
        minutes: 42,
        seconds: 30
    });


    const router = useRouter()
    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev: TimeLeft) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else if (prev.days > 0) {
                    return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Flocking particles (boids algorithm)
    const [particles, setParticles] = useState<Particle[]>([]);

    // Initialize particles with flocking behavior
    useEffect(() => {
        const initParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.3
        }));
        setParticles(initParticles);
    }, []);

    // Flocking animation loop
    useEffect(() => {
        const animateParticles = (): void => {
            setParticles((prev: Particle[]) => prev.map((particle: Particle) => {
                let { x, y, vx, vy } = particle;

                // Flocking forces
                let separationX = 0, separationY = 0;
                let alignmentX = 0, alignmentY = 0;
                let cohesionX = 0, cohesionY = 0;
                let neighbors = 0;

                // Calculate forces from nearby particles
                prev.forEach((other: Particle) => {
                    if (other.id === particle.id) return;

                    const dx: number = other.x - x;
                    const dy: number = other.y - y;
                    const distance: number = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        // Separation - avoid crowding
                        if (distance < 50) {
                            separationX -= dx / distance;
                            separationY -= dy / distance;
                        }

                        // Alignment - match velocity
                        alignmentX += other.vx;
                        alignmentY += other.vy;

                        // Cohesion - move toward center
                        cohesionX += other.x;
                        cohesionY += other.y;

                        neighbors++;
                    }
                });

                if (neighbors > 0) {
                    // Apply alignment
                    alignmentX /= neighbors;
                    alignmentY /= neighbors;
                    vx += (alignmentX - vx) * 0.05;
                    vy += (alignmentY - vy) * 0.05;

                    // Apply cohesion
                    cohesionX = (cohesionX / neighbors) - x;
                    cohesionY = (cohesionY / neighbors) - y;
                    vx += cohesionX * 0.01;
                    vy += cohesionY * 0.01;
                }

                // Apply separation
                vx += separationX * 0.1;
                vy += separationY * 0.1;

                // Limit velocity
                const speed: number = Math.sqrt(vx * vx + vy * vy);
                const maxSpeed: number = 1.5;
                if (speed > maxSpeed) {
                    vx = (vx / speed) * maxSpeed;
                    vy = (vy / speed) * maxSpeed;
                }

                // Update position
                x += vx;
                y += vy;

                // Wrap around edges
                const screenWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200;
                const screenHeight: number = typeof window !== 'undefined' ? window.innerHeight : 800;
                if (x < 0) x = screenWidth;
                if (x > screenWidth) x = 0;
                if (y < 0) y = screenHeight;
                if (y > screenHeight) y = 0;

                return { ...particle, x, y, vx, vy };
            }));
        };

        const interval: NodeJS.Timeout = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    // Main container animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                when: "beforeChildren" as const,
                staggerChildren: 0.15,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.6, ease: "easeInOut" }
        },
    };

    // Child element animations
    const childVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        },
    };

    // Glowing orb animation
    const orbVariants = {
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear" as const
            }
        }
    };

    const handleNotifyClick = (): void => {
        toast.success("You'll be notified when we launch!");
    };

    const handleBackClick = (): void => {
        router.push("/")
    };

    return (
        <AnimatePresence>
            <motion.div
                className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 py-6 via-zinc-900 to-slate-950 text-white px-4 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Orbs */}
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                        variants={orbVariants}
                        animate="animate"
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                        variants={orbVariants}
                        animate="animate"
                        style={{ animationDelay: "2s" }}
                    />

                    {/* Flocking Particles - Boids Algorithm */}
                    {particles.map((particle: Particle) => (
                        <div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-white rounded-full transition-opacity duration-1000"
                            style={{
                                left: `${particle.x}px`,
                                top: `${particle.y}px`,
                                opacity: particle.opacity,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none'
                            }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Logo/Icon */}
                    <motion.div
                        className="mb-8"
                        variants={childVariants}
                    >
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
                        variants={childVariants}
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Coming
                        </span>{" "}
                        <span className="text-white">Soon</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                        variants={childVariants}
                    >
                        We're crafting something extraordinary that will revolutionize your experience.
                        <br />
                        <span className="text-slate-400 text-lg">
                            Get ready for the future of innovation.
                        </span>
                    </motion.p>

                    {/* Countdown Timer */}
                    <motion.div
                        className="mb-12"
                        variants={childVariants}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                            {Object.entries(timeLeft).map(([unit, value]: [string, number]) => (
                                <div key={unit} className="text-center">
                                    <motion.div
                                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 mb-2"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="text-2xl md:text-3xl font-bold text-white">
                                            {value.toString().padStart(2, '0')}
                                        </div>
                                    </motion.div>
                                    <div className="text-sm text-slate-400 capitalize font-medium">
                                        {unit}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        className="mb-12 max-w-md mx-auto"
                        variants={childVariants}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Development Progress</span>
                            <span className="text-sm text-slate-300 font-semibold">85%</span>
                        </div>
                        <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/20 rounded-full"
                                    animate={{
                                        x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 2
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        variants={childVariants}
                    >
                        <motion.button
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
                            onClick={handleNotifyClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                🔔 Notify Me
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ x: "100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>

                        <motion.button
                            className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-slate-100 rounded-full font-semibold text-lg border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300"
                            onClick={handleBackClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            ← Back to Dashboard
                        </motion.button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        className="mt-16 text-center"
                        variants={childVariants}
                    >
                        <p className="text-slate-400 mb-4">Join thousands of others waiting for launch</p>
                        <div className="flex justify-center items-center gap-2">
                            <div className="flex -space-x-2">
                                {Array.from({ length: 5 }).map((_, i: number) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-slate-800"
                                    />
                                ))}
                            </div>
                            <span className="text-slate-300 ml-3 font-medium">+2,847 waiting</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}