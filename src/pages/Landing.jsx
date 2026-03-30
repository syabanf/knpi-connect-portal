import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, Megaphone, ArrowRight, ChevronRight, Star, MapPin, Globe, Award, TrendingUp, Shield, Phone, Mail, Menu, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const stats = [
  { label: "Active Members", value: "12,000+", icon: Users },
  { label: "Regional Chapters", value: "34", icon: Globe },
  { label: "Events Per Year", value: "500+", icon: Calendar },
  { label: "Years of Service", value: "50+", icon: Award },
];

const programs = [
  {
    icon: TrendingUp,
    title: "Leadership Development",
    desc: "Comprehensive programs to nurture the next generation of national leaders through training, mentorship, and real-world experience.",
    color: "from-blue-500 to-blue-600",
    img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&q=80",
  },
  {
    icon: Globe,
    title: "Community Empowerment",
    desc: "Driving social change through grassroots community programs, volunteer initiatives, and sustainable development projects.",
    color: "from-emerald-500 to-emerald-600",
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80",
  },
  {
    icon: Shield,
    title: "Youth Advocacy",
    desc: "Championing youth rights and interests at local, national, and international levels through policy engagement.",
    color: "from-purple-500 to-purple-600",
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
  },
];

const eventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
];

const newsImages = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80",
];

export default function Landing() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    base44.entities.Announcement.filter({ published: true }, '-created_date', 3)
      .then(setAnnouncements).catch(() => {});
    base44.entities.Event.filter({ status: 'upcoming' }, 'date', 4)
      .then(setEvents).catch(() => {});
  }, []);

  const handleEnter = (role) => {
    localStorage.setItem('dummyRole', role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-heading font-extrabold text-lg">K</span>
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-gray-900">KNPI</span>
              <span className="font-heading text-sm text-primary ml-1 hidden sm:inline">Connect Portal</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#programs" className="hover:text-primary transition-colors">Programs</a>
            <a href="#events" className="hover:text-primary transition-colors">Events</a>
            <a href="#news" className="hover:text-primary transition-colors">News</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" onClick={() => handleEnter('user')} className="font-semibold border-primary text-primary hover:bg-primary hover:text-white">
              Member Portal
            </Button>
            <Button onClick={() => handleEnter('admin')} className="font-semibold">
              Admin Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-600">About</a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-600">Programs</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-600">Events</a>
            <a href="#news" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-gray-600">News</a>
            <div className="flex flex-col gap-2 mt-2">
              <Button onClick={() => handleEnter('user')} className="w-full font-semibold">Member Portal</Button>
              <Button onClick={() => handleEnter('admin')} variant="outline" className="w-full font-semibold">Admin Portal</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=90')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Komite Nasional Pemuda Indonesia</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Empowering<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                Indonesia's Youth
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-xl">
              The National Youth Committee of Indonesia — uniting young leaders to build a stronger, more prosperous nation together.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => handleEnter('user')} className="font-bold px-10 py-6 text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30">
                Access Member Portal <ArrowRight className="w-5 h-5" />
              </Button>
              <a href="#about">
                <Button size="lg" variant="outline" className="font-semibold px-8 py-6 text-base text-white border-white/40 hover:bg-white/10 hover:text-white">
                  Discover KNPI
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="text-4xl font-heading font-extrabold text-yellow-300">{s.value}</div>
                <div className="text-sm text-blue-100 mt-1 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">About KNPI</span>
              <h2 className="text-4xl font-heading font-extrabold text-gray-900 mt-3 leading-tight">
                A Legacy of Youth<br />Leadership Since 1973
              </h2>
              <p className="text-gray-600 mt-5 leading-relaxed text-lg">
                Komite Nasional Pemuda Indonesia (KNPI) is the umbrella organization for youth movements across Indonesia. Founded in 1973, KNPI has been the forefront of youth advocacy, leadership development, and national service.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                With over 12,000 active members spread across 34 provincial chapters, KNPI plays a critical role in shaping national policy, empowering communities, and developing Indonesia's future leaders.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { title: "Our Vision", text: "A united, progressive, and self-reliant youth of Indonesia." },
                  { title: "Our Mission", text: "To develop youth potential and advocate for youth interests nationally." },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h4 className="font-heading font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="relative">
              <img
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=85"
                alt="KNPI Youth Leadership"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-xl border border-gray-100 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-gray-900">50+ Years</div>
                    <div className="text-xs text-gray-500">of Youth Empowerment</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-4xl font-heading font-extrabold text-gray-900 mt-3">Our Core Programs</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Comprehensive initiatives designed to develop, empower, and connect Indonesian youth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-60`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <p.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-900">{p.title}</h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">{p.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">What's On</span>
              <h2 className="text-4xl font-heading font-extrabold text-gray-900 mt-2">Upcoming Events</h2>
              <p className="text-gray-500 mt-3">Don't miss out on these transformative opportunities</p>
            </div>
            <button onClick={() => handleEnter('user')} className="hidden sm:flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
              View all events <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((e, i) => (
                <motion.div key={e.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <a href={`/event/${e.id}`} className="group block w-full text-left bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={eventImages[i % eventImages.length]}
                        alt={e.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">{e.type}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-primary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h3 className="font-heading font-bold mt-1.5 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">{e.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{e.location}
                      </p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No upcoming events at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section id="news" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Stay Updated</span>
              <h2 className="text-4xl font-heading font-extrabold text-gray-900 mt-2">Latest News</h2>
              <p className="text-gray-500 mt-3">Official announcements and updates from KNPI</p>
            </div>
            <button onClick={() => handleEnter('user')} className="hidden sm:flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
              All announcements <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {announcements.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <a href={`/news/${a.id}`} className="group block w-full text-left bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={newsImages[i % newsImages.length]}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${a.priority === 'high' ? 'bg-red-500 text-white' : 'bg-white text-gray-800'}`}>
                          {a.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-400">{new Date(a.created_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <h3 className="font-heading font-bold text-gray-900 mt-1.5 line-clamp-2 group-hover:text-primary transition-colors">{a.title}</h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{a.content}</p>
                      <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold">
                        Read more <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </a>
                </motion.div>
                ))}
                </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No announcements yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
              Ready to Join the Movement?
            </h2>
            <p className="text-blue-100 mt-5 text-xl max-w-2xl mx-auto">
              Become part of Indonesia's largest youth network. Access exclusive resources, events, and opportunities through the KNPI Member Portal.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => handleEnter('user')} className="font-bold px-10 py-6 text-base bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-xl">
                Member Portal <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleEnter('admin')} className="font-semibold px-8 py-6 text-base text-white border-white/40 hover:bg-white/10 hover:text-white">
                Admin Portal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-heading font-extrabold">K</span>
                </div>
                <span className="font-heading font-bold text-xl text-gray-900">KNPI</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Komite Nasional Pemuda Indonesia<br />
                Jl. Pemuda Raya No. 1, Jakarta Pusat<br />
                DKI Jakarta, Indonesia 10310
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+62 21 1234 5678</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@knpi.or.id</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>www.knpi.or.id</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["About KNPI", "Our Programs", "Events", "News", "Member Portal"].map(link => (
                  <button key={link} onClick={() => handleEnter('user')} className="block text-sm text-gray-500 hover:text-primary transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Komite Nasional Pemuda Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}