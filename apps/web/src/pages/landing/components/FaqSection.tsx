import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  questionJp: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question:
      "Apakah saya harus sudah bisa bahasa Jepang (punya sertifikat JLPT) untuk bergabung?",
    questionJp: "日本語の資格がなくても応募できますか？",
    answer:
      "Tidak wajib. Kamu bisa mulai mendaftar meski belum memiliki kemampuan bahasa Jepang sama sekali. Platform JIJP menyediakan modul kurikulum mandiri dan kelas bimbingan terstruktur mulai dari nol (Hiragana, Katakana, N5) hingga persiapan ujian JLPT N4/N3 yang merupakan syarat minimal sebagian besar industri di Jepang.",
  },
  {
    question: "Jenis visa kerja apa saja yang difasilitasi oleh JIJP?",
    questionJp: "どのような在留資格（ビザ）に対応していますか？",
    answer:
      "JIJP memfasilitasi jalur visa kerja resmi sesuai kualifikasi pendidikanmu: (1) Tokutei Ginou / Specified Skilled Worker (SSW 1 & SSW 2) untuk bidang manufaktur, perhotelan, pertanian, pengolahan makanan, dan konstruksi; serta (2) Gijinkoku (Engineer / Specialist in Humanities) bagi lulusan D3/D4/S1 jurusan Teknik, Komputer/IT, dan Bahasa.",
  },
  {
    question:
      "Apakah ada biaya pendaftaran tersembunyi atau potongan gaji sepihak?",
    questionJp: "不透明な仲介手数料や給与天引きはありますか？",
    answer:
      "Sama sekali tidak ada. JIJP berpegang teguh pada prinsip Zero-Exploitation dan kepatuhan bilateral. Semua penawaran kerja mencantumkan rincian upah pokok, tunjangan, asuransi sosial Jepang (Shakai Hoken), dan biaya sewa tempat tinggal secara transparan sebelum kontrak ditandatangani.",
  },
  {
    question: "Bagaimana cara kerja pembuatan CV format Jepang (Rirekisho)?",
    questionJp: "日本規格の履歴書作成はどのように行われますか？",
    answer:
      "Cukup lengkapi data profil dan portofoliomu di platform. Sistem JIJP secara otomatis menyusun dan mengonversi berkasmu menjadi dokumen Rirekisho & Shokumu Keirekisho berstandar resmi JIS (Japanese Industrial Standards) dalam bahasa Jepang yang siap diajukan ke HR perusahaan mitra.",
  },
  {
    question:
      "Apa keunggulan mentoring dari Senior Industry Mentors (Silver Mentors)?",
    questionJp: "シニアメンターによる指導のメリットは何ですか？",
    answer:
      "Silver Mentors kami adalah para profesional dan eksekutif purnatugas korporasi global Jepang (seperti ex-Toyota dan Nippon Steel). Mereka memberikan simulasi langsung etika wawancara bisnis (Keigo), budaya pengambilan keputusan (Nemawashi), serta protokol keselamatan industri (5S), sehingga kamu tiba di Jepang dengan kesiapan mental profesional.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Tanya Jawab Populer</span>
            <span>•</span>
            <span className="font-normal font-mono">よくある質問</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Segala hal yang perlu kamu ketahui seputar persiapan, legalitas
            visa, dan proses seleksi kerja ke Jepang.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-slate-900 hover:text-red-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div>
                    <div className="text-base sm:text-lg leading-snug">
                      {faq.question}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 font-normal">
                      {faq.questionJp}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-red-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help note */}
        <div className="mt-10 text-center text-xs text-slate-500">
          Punya pertanyaan spesifik lain? Hubungi tim pendamping kami melalui
          email di{" "}
          <a
            href="mailto:support@jijp.id"
            className="font-bold text-red-600 hover:underline"
          >
            support@jijp.id
          </a>
        </div>
      </div>
    </section>
  );
}
