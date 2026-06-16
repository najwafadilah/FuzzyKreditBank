function prosesFuzzy() {

    // ─────────────────────────
    // 1. INPUT
    // ─────────────────────────

    const penghasilan = parseFloat(document.getElementById("penghasilan").value);
    const lamaKerja   = parseFloat(document.getElementById("lamaKerja").value);
    const riwayat     = parseFloat(document.getElementById("riwayat").value);
    const hutang      = parseFloat(document.getElementById("hutang").value);

    if ([penghasilan, lamaKerja, riwayat, hutang].some(isNaN)) {
        alert("Harap isi semua input terlebih dahulu!");
        return;
    }


    // ─────────────────────────
    // 2. FUZZIFIKASI
    // ─────────────────────────

    // -- Penghasilan (0-15 juta) --
    let penghasilanRendah = 0, penghasilanSedang = 0, penghasilanTinggi = 0;

    if      (penghasilan <= 5)                      penghasilanRendah = 1;
    else if (penghasilan > 5  && penghasilan <= 7)  penghasilanRendah = (7  - penghasilan) / 2;

    if      (penghasilan > 5  && penghasilan <= 8)  penghasilanSedang = (penghasilan - 5)  / 3;
    else if (penghasilan > 8  && penghasilan <= 11) penghasilanSedang = (11 - penghasilan) / 3;

    if      (penghasilan > 9  && penghasilan <= 11) penghasilanTinggi = (penghasilan - 9)  / 2;
    else if (penghasilan >= 11)                     penghasilanTinggi = 1;

    // -- Lama Bekerja (0-15 tahun) --
    let kerjaBaru = 0, kerjaCukup = 0, kerjaLama = 0;

    if      (lamaKerja <= 3)                        kerjaBaru  = 1;
    else if (lamaKerja > 3  && lamaKerja <= 5)      kerjaBaru  = (5  - lamaKerja) / 2;

    if      (lamaKerja > 3  && lamaKerja <= 6)      kerjaCukup = (lamaKerja - 3)  / 3;
    else if (lamaKerja > 6  && lamaKerja <= 9)      kerjaCukup = (9  - lamaKerja) / 3;

    if      (lamaKerja > 7  && lamaKerja <= 9)      kerjaLama  = (lamaKerja - 7)  / 2;
    else if (lamaKerja >= 9)                        kerjaLama  = 1;

    // -- Riwayat Kredit (0-100) --
    let kreditBuruk = 0, kreditSedang = 0, kreditBaik = 0;

    if      (riwayat <= 50)                         kreditBuruk  = 1;
    else if (riwayat > 50  && riwayat <= 60)        kreditBuruk  = (60 - riwayat) / 10;

    if      (riwayat > 50  && riwayat <= 65)        kreditSedang = (riwayat - 50) / 15;
    else if (riwayat > 65  && riwayat <= 80)        kreditSedang = (80 - riwayat) / 15;

    if      (riwayat > 70  && riwayat <= 80)        kreditBaik   = (riwayat - 70) / 10;
    else if (riwayat >= 80)                         kreditBaik   = 1;

    // -- Rasio Hutang (0-100%) --
    let hutangRendah = 0, hutangSedang = 0, hutangTinggi = 0;

    if      (hutang <= 30)                          hutangRendah = 1;
    else if (hutang > 30   && hutang <= 40)         hutangRendah = (40 - hutang)  / 10;

    if      (hutang > 30   && hutang <= 50)         hutangSedang = (hutang - 30)  / 20;
    else if (hutang > 50   && hutang <= 70)         hutangSedang = (70 - hutang)  / 20;

    if      (hutang > 60   && hutang <= 70)         hutangTinggi = (hutang - 60)  / 10;
    else if (hutang >= 70)                          hutangTinggi = 1;


    // ─────────────────────────
    // 3. RULE BASE — 81 RULE
    // ─────────────────────────
    //
    // Key  : "iP,iL,iR,iH"
    //   iP : 0=Rendah  1=Sedang  2=Tinggi   (Penghasilan)
    //   iL : 0=Baru    1=Cukup   2=Lama     (Lama Kerja)
    //   iR : 0=Buruk   1=Sedang  2=Baik     (Riwayat Kredit)
    //   iH : 0=Rendah  1=Sedang  2=Tinggi   (Rasio Hutang)
    //
    // Value: 0=Ditolak  1=Dipertimbangkan  2=Disetujui
    //
    // Logika bisnis:
    //   Penghasilan Rendah  → cenderung Ditolak kecuali faktor lain sangat mendukung
    //   Penghasilan Sedang  → bervariasi sesuai kombinasi faktor lain
    //   Penghasilan Tinggi  → cenderung Disetujui, tapi tetap mempertimbangkan hutang & riwayat
    // ─────────────────────────

    const ruleTable = {

        // ══ PENGHASILAN RENDAH ══════════════════════════════════
        //         iH→  Rendah  Sedang  Tinggi
        "0,0,0,0": 0, "0,0,0,1": 0, "0,0,0,2": 0,  // Baru,   Buruk
        "0,0,1,0": 0, "0,0,1,1": 0, "0,0,1,2": 0,  // Baru,   Sedang
        "0,0,2,0": 0, "0,0,2,1": 0, "0,0,2,2": 0,  // Baru,   Baik

        "0,1,0,0": 0, "0,1,0,1": 0, "0,1,0,2": 0,  // Cukup,  Buruk
        "0,1,1,0": 0, "0,1,1,1": 0, "0,1,1,2": 0,  // Cukup,  Sedang
        "0,1,2,0": 1, "0,1,2,1": 0, "0,1,2,2": 0,  // Cukup,  Baik

        "0,2,0,0": 0, "0,2,0,1": 0, "0,2,0,2": 0,  // Lama,   Buruk
        "0,2,1,0": 1, "0,2,1,1": 0, "0,2,1,2": 0,  // Lama,   Sedang
        "0,2,2,0": 1, "0,2,2,1": 1, "0,2,2,2": 0,  // Lama,   Baik

        // ══ PENGHASILAN SEDANG ══════════════════════════════════
        "1,0,0,0": 0, "1,0,0,1": 0, "1,0,0,2": 0,  // Baru,   Buruk
        "1,0,1,0": 1, "1,0,1,1": 0, "1,0,1,2": 0,  // Baru,   Sedang
        "1,0,2,0": 1, "1,0,2,1": 1, "1,0,2,2": 0,  // Baru,   Baik

        "1,1,0,0": 0, "1,1,0,1": 0, "1,1,0,2": 0,  // Cukup,  Buruk
        "1,1,1,0": 1, "1,1,1,1": 1, "1,1,1,2": 0,  // Cukup,  Sedang
        "1,1,2,0": 2, "1,1,2,1": 1, "1,1,2,2": 0,  // Cukup,  Baik

        "1,2,0,0": 0, "1,2,0,1": 0, "1,2,0,2": 0,  // Lama,   Buruk
        "1,2,1,0": 1, "1,2,1,1": 1, "1,2,1,2": 0,  // Lama,   Sedang
        "1,2,2,0": 2, "1,2,2,1": 1, "1,2,2,2": 1,  // Lama,   Baik

        // ══ PENGHASILAN TINGGI ══════════════════════════════════
        "2,0,0,0": 1, "2,0,0,1": 0, "2,0,0,2": 0,  // Baru,   Buruk
        "2,0,1,0": 1, "2,0,1,1": 1, "2,0,1,2": 0,  // Baru,   Sedang
        "2,0,2,0": 2, "2,0,2,1": 1, "2,0,2,2": 1,  // Baru,   Baik

        "2,1,0,0": 1, "2,1,0,1": 1, "2,1,0,2": 0,  // Cukup,  Buruk
        "2,1,1,0": 2, "2,1,1,1": 1, "2,1,1,2": 1,  // Cukup,  Sedang
        "2,1,2,0": 2, "2,1,2,1": 2, "2,1,2,2": 1,  // Cukup,  Baik

        "2,2,0,0": 1, "2,2,0,1": 1, "2,2,0,2": 0,  // Lama,   Buruk
        "2,2,1,0": 2, "2,2,1,1": 2, "2,2,1,2": 1,  // Lama,   Sedang
        "2,2,2,0": 2, "2,2,2,1": 2, "2,2,2,2": 2,  // Lama,   Baik
    };

    const namaPenghasilan = ["Rendah", "Sedang", "Tinggi"];
    const namaLamaKerja   = ["Baru",   "Cukup",  "Lama"  ];
    const namaRiwayat     = ["Buruk",  "Sedang", "Baik"  ];
    const namaHutang      = ["Rendah", "Sedang", "Tinggi"];
    const namaOutput      = ["Ditolak","Dipertimbangkan","Disetujui"];

    const muPenghasilan = [penghasilanRendah, penghasilanSedang, penghasilanTinggi];
    const muLamaKerja   = [kerjaBaru,         kerjaCukup,        kerjaLama        ];
    const muRiwayat     = [kreditBuruk,        kreditSedang,      kreditBaik       ];
    const muHutang      = [hutangRendah,        hutangSedang,      hutangTinggi     ];


    // ─────────────────────────
    // 4. INFERENSI MAMDANI
    // ─────────────────────────

    let alphaDitolak = 0, alphaDipertimbangkan = 0, alphaDisetujui = 0;
    const ruleAktif  = [];
    let   ruleNo     = 1;

    for (let iP = 0; iP < 3; iP++) {
        for (let iL = 0; iL < 3; iL++) {
            for (let iR = 0; iR < 3; iR++) {
                for (let iH = 0; iH < 3; iH++) {

                    const key    = `${iP},${iL},${iR},${iH}`;
                    const output = ruleTable[key];
                    const alpha  = Math.min(
                        muPenghasilan[iP],
                        muLamaKerja[iL],
                        muRiwayat[iR],
                        muHutang[iH]
                    );

                    // Komposisi MAX per kategori output
                    if      (output === 0) alphaDitolak         = Math.max(alphaDitolak,         alpha);
                    else if (output === 1) alphaDipertimbangkan = Math.max(alphaDipertimbangkan, alpha);
                    else if (output === 2) alphaDisetujui       = Math.max(alphaDisetujui,       alpha);

                    // Simpan rule yang aktif (alpha > 0)
                    if (alpha > 0) {
                        ruleAktif.push({
                            no         : ruleNo,
                            penghasilan: namaPenghasilan[iP],
                            lamaKerja  : namaLamaKerja[iL],
                            riwayat    : namaRiwayat[iR],
                            hutang     : namaHutang[iH],
                            output     : namaOutput[output],
                            alpha      : alpha
                        });
                    }

                    ruleNo++;
                }
            }
        }
    }

    // Hasil komposisi MAX
    const ditolak         = alphaDitolak;
    const dipertimbangkan = alphaDipertimbangkan;
    const disetujui       = alphaDisetujui;


    // ─────────────────────────
    // 5. DEFUZZIFIKASI (Centroid, step 0.1)
    // ─────────────────────────
    //
    // Fungsi keanggotaan OUTPUT:
    //   Ditolak         : datar 1 (z<=40), turun linear (40<z<=50)
    //   Dipertimbangkan : naik  (40<z<=60), turun (60<z<=80)
    //   Disetujui       : naik  (70<z<=80), datar 1 (z>=80)
    // ─────────────────────────

    let pembilang = 0, penyebut = 0;

    for (let z = 0; z <= 100; z += 0.1) {

        let muDitolak = 0;
        if      (z <= 40)            muDitolak = 1;
        else if (z > 40 && z <= 50)  muDitolak = (50 - z) / 10;

        let muDipertimbangkan = 0;
        if      (z > 40 && z <= 60)  muDipertimbangkan = (z  - 40) / 20;
        else if (z > 60 && z <= 80)  muDipertimbangkan = (80 - z)  / 20;

        let muDisetujui = 0;
        if      (z > 70 && z <= 80)  muDisetujui = (z  - 70) / 10;
        else if (z >= 80)            muDisetujui = 1;

        const alpha = Math.max(
            Math.min(ditolak,         muDitolak),
            Math.min(dipertimbangkan, muDipertimbangkan),
            Math.min(disetujui,       muDisetujui)
        );

        pembilang += z * alpha;
        penyebut  += alpha;
    }

    const hasilCrisp = pembilang / penyebut;


    // ─────────────────────────
    // 6. KEPUTUSAN
    // ─────────────────────────

    let labelKeputusan, kelasKeputusan;

    if (hasilCrisp >= 70) {
        labelKeputusan = "✅ KREDIT DISETUJUI";
        kelasKeputusan = "disetujui";
    } else if (hasilCrisp >= 50) {
        labelKeputusan = "⚖️ KREDIT DIPERTIMBANGKAN";
        kelasKeputusan = "dipertimbangkan";
    } else {
        labelKeputusan = "❌ KREDIT DITOLAK";
        kelasKeputusan = "ditolak";
    }


    // ─────────────────────────
    // 7. TAMPILKAN HASIL
    // ─────────────────────────

    const f4 = v => v.toFixed(4);
    const f2 = v => v.toFixed(2);

    // -- Hasil akhir --
    const elKeputusan = document.getElementById("el-keputusan");
    elKeputusan.textContent = labelKeputusan;
    elKeputusan.className   = "status-keputusan " + kelasKeputusan;
    document.getElementById("el-crisp").textContent = f2(hasilCrisp);

    // -- Fuzzifikasi --
    document.getElementById("fp-rendah").textContent = f4(penghasilanRendah);
    document.getElementById("fp-sedang").textContent = f4(penghasilanSedang);
    document.getElementById("fp-tinggi").textContent = f4(penghasilanTinggi);
    document.getElementById("fk-baru").textContent   = f4(kerjaBaru);
    document.getElementById("fk-cukup").textContent  = f4(kerjaCukup);
    document.getElementById("fk-lama").textContent   = f4(kerjaLama);
    document.getElementById("fr-buruk").textContent  = f4(kreditBuruk);
    document.getElementById("fr-sedang").textContent = f4(kreditSedang);
    document.getElementById("fr-baik").textContent   = f4(kreditBaik);
    document.getElementById("fh-rendah").textContent = f4(hutangRendah);
    document.getElementById("fh-sedang").textContent = f4(hutangSedang);
    document.getElementById("fh-tinggi").textContent = f4(hutangTinggi);

    // -- Komposisi MAX --
    document.getElementById("komp-tolak").textContent      = f4(ditolak);
    document.getElementById("komp-pertimbang").textContent = f4(dipertimbangkan);
    document.getElementById("komp-setuju").textContent     = f4(disetujui);

    // -- Defuzzifikasi --
    document.getElementById("d-pembilang").textContent = f2(pembilang);
    document.getElementById("d-penyebut").textContent  = f4(penyebut);
    document.getElementById("d-crisp").textContent     = f2(hasilCrisp);

    // -- Tabel rule aktif --
    const badgeClass = out =>
        out === "Disetujui"       ? "badge badge-disetujui"       :
        out === "Dipertimbangkan" ? "badge badge-dipertimbangkan" :
                                    "badge badge-ditolak";

    const tbody = document.getElementById("tbody-rule");

    if (ruleAktif.length === 0) {
        tbody.innerHTML = `<tr>
            <td colspan="7" style="text-align:center;color:#a0aec0;padding:20px;">
                Tidak ada rule yang aktif untuk input ini.
            </td>
        </tr>`;
    } else {
        tbody.innerHTML = ruleAktif.map(r => `
            <tr>
                <td>R${r.no}</td>
                <td>${r.penghasilan}</td>
                <td>${r.lamaKerja}</td>
                <td>${r.riwayat}</td>
                <td>${r.hutang}</td>
                <td><span class="${badgeClass(r.output)}">${r.output}</span></td>
                <td class="alpha-val">${r.alpha.toFixed(4)}</td>
            </tr>`).join("");
    }

    document.getElementById("el-rule-count").textContent =
        `— ${ruleAktif.length} aktif dari 81 rule`;

    document.getElementById("el-rule-info").textContent =
        `Menampilkan ${ruleAktif.length} rule dengan α > 0 dari total 81 rule base.`;

    // -- Tampilkan section hasil & scroll --
    const container = document.getElementById("hasil-container");
    container.style.display = "block";
    container.scrollIntoView({ behavior: "smooth" });
}
