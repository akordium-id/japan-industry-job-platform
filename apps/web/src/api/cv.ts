const BASE = import.meta.env.VITE_API_URL ?? "";

export const cvApi = {
  downloadUrl: () => "/api/cv/generate",
  async triggerDownload(candidateId?: number): Promise<void> {
    const urlPath = candidateId
      ? `/api/cv/export?candidateId=${candidateId}`
      : "/api/cv/export";
    const res = await fetch(`${BASE}${urlPath}`, { credentials: "include" });
    if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = candidateId ? `rirekisho-${candidateId}.pdf` : "rirekisho.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
