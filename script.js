function prosesFuzzy() {

    // =========================
    // INPUT
    // =========================

    let penghasilan = parseFloat(document.getElementById("penghasilan").value);
    let lamaKerja   = parseFloat(document.getElementById("lamaKerja").value);
    let riwayat     = parseFloat(document.getElementById("riwayat").value);
    let hutang      = parseFloat(document.getElementById("hutang").value);

    if (isNaN(penghasilan) || isNaN(lamaKerja) || isNaN(riwayat) || isNaN(hutang)) {
        alert("Harap isi semua input terlebih dahulu.");
        return;
    }

    // =========================
    // FUZZIFIKASI PENGHASILAN
    // =========================

    let penghasilanRendah = 0, penghasilanSedang = 0, penghasilanTinggi = 0;

    if (penghasilan <= 5) penghasilanRendah = 1;
    else if (penghasilan > 5 && penghasilan <= 7)
        penghasilanRendah = (7 - penghasilan) / (7 - 5);

    if (penghasilan > 5 && penghasilan <= 8)
        penghasilanSedang = (penghasilan - 5) / (8 - 5);
    else if (penghasilan > 8 && penghasilan <= 11)
        penghasilanSedang = (11 - penghasilan) / (11 - 8);

    if (penghasilan > 9 && penghasilan <= 11)
        penghasilanTinggi = (penghasilan - 9) / (11 - 9);
    else if (penghasilan >= 11) penghasilanTinggi = 1;

    // =========================
    // FUZZIFIKASI LAMA KERJA
    // =========================

    let kerjaBaru = 0, kerjaCukup = 0, kerjaLama = 0;

    if (lamaKerja <= 3) kerjaBaru = 1;
    else if (lamaKerja > 3 && lamaKerja <= 5)
        kerjaBaru = (5 - lamaKerja) / (5 - 3);

    if (lamaKerja > 3 && lamaKerja <= 6)
        kerjaCukup = (lamaKerja - 3) / (6 - 3);
    else if (lamaKerja > 6 && lamaKerja <= 9)
        kerjaCukup = (9 - lamaKerja) / (9 - 6);

    if (lamaKerja > 7 && lamaKerja <= 9)
        kerjaLama = (lamaKerja - 7) / (9 - 7);
    else if (lamaKerja >= 9) kerjaLama = 1;

    // =========================
    // FUZZIFIKASI RIWAYAT KREDIT
    // =========================

    let kreditBuruk = 0, kreditSedang = 0, kreditBaik = 0;

    if (riwayat <= 50) kreditBuruk = 1;
    else if (riwayat > 50 && riwayat <= 60)
        kreditBuruk = (60 - riwayat) / (60 - 50);

    if (riwayat > 50 && riwayat <= 65)
        kreditSedang = (riwayat - 50) / (65 - 50);
    else if (riwayat > 65 && riwayat <= 80)
        kreditSedang = (80 - riwayat) / (80 - 65);

    if (riwayat > 70 && riwayat <= 80)
        kreditBaik = (riwayat - 70) / (80 - 70);
    else if (riwayat >= 80) kreditBaik = 1;

    // =========================
    // FUZZIFIKASI RASIO HUTANG
    // =========================

    let hutangRendah = 0, hutangSedang = 0, hutangTinggi = 0;

    if (hutang <= 30) hutangRendah = 1;
    else if (hutang > 30 && hutang <= 40)
        hutangRendah = (40 - hutang) / (40 - 30);

    if (hutang > 30 && hutang <= 50)
        hutangSedang = (hutang - 30) / (50 - 30);
    else if (hutang > 50 && hutang <= 70)
        hutangSedang = (70 - hutang) / (70 - 50);

    if (hutang > 60 && hutang <= 70)
        hutangTinggi = (hutang - 60) / (70 - 60);
    else if (hutang >= 70) hutangTinggi = 1;

    // =========================
    // INFERENSI MAMDANI - 81 RULE
    // Index: 0=Rendah/Baru/Buruk, 1=Sedang/Cukup/Sedang, 2=Tinggi/Lama/Baik
    // Hutang: 0=Rendah(bagus), 1=Sedang, 2=Tinggi(buruk)
    // Output: 0=Ditolak, 1=Dipertimbangkan, 2=Disetujui
    // =========================

    const muPenghasilan = [penghasilanRendah, penghasilanSedang, penghasilanTinggi];
    const muLamaKerja   = [kerjaBaru,         kerjaCukup,        kerjaLama];
    const muRiwayat     = [kreditBuruk,        kreditSedang,      kreditBaik];
    const muHutang      = [hutangRendah,        hutangSedang,      hutangTinggi];

    const namaOutput      = ['Ditolak', 'Dipertimbangkan', 'Disetujui'];
    const namaPenghasilan = ['Rendah', 'Sedang', 'Tinggi'];
    const namaLamaKerja   = ['Baru', 'Cukup', 'Lama'];
    const namaRiwayat     = ['Buruk', 'Sedang', 'Baik'];
    const namaHutang      = ['Rendah', 'Sedang', 'Tinggi'];

    // 81 Rule Base [iP][iL][iR][iH] → output (0/1/2)
    const ruleTable = {
        // --- PENGHASILAN RENDAH ---
        "0,0,0,0": 0, "0,0,0,1": 0, "0,0,0,2": 0,
        "0,0,1,0": 0, "0,0,1,1": 0, "0,0,1,2": 0,
        "0,0,2,0": 0, "0,0,2,1": 0, "0,0,2,2": 0,
        "0,1,0,0": 0, "0,1,0,1": 0, "0,1,0,2": 0,
        "0,1,1,0": 0, "0,1,1,1": 0, "0,1,1,2": 0,
        "0,1,2,0": 1, "0,1,2,1": 0, "0,1,2,2": 0,
        "0,2,0,0": 0, "0,2,0,1": 0, "0,2,0,2": 0,
        "0,2,1,0": 1, "0,2,1,1": 0, "0,2,1,2": 0,
        "0,2,2,0": 1, "0,2,2,1": 0, "0,2,2,2": 0,

        // --- PENGHASILAN SEDANG ---
        "1,0,0,0": 0, "1,0,0,1": 0, "1,0,0,2": 0,
        "1,0,1,0": 1, "1,0,1,1": 1, "1,0,1,2": 0,
        "1,0,2,0": 2, "1,0,2,1": 1, "1,0,2,2": 1,
        "1,1,0,0": 0, "1,1,0,1": 1, "1,1,0,2": 0,
        "1,1,1,0": 1, "1,1,1,1": 1, "1,1,1,2": 0,
        "1,1,2,0": 2, "1,1,2,1": 1, "1,1,2,2": 1,
        "1,2,0,0": 1, "1,2,0,1": 1, "1,2,0,2": 0,
        "1,2,1,0": 2, "1,2,1,1": 1, "1,2,1,2": 1,
        "1,2,2,0": 2, "1,2,2,1": 2, "1,2,2,2": 1,

        // --- PENGHASILAN TINGGI ---
        "2,0,0,0": 2, "2,0,0,1": 2, "2,0,0,2": 0,
        "2,0,1,0": 2, "2,0,1,1": 2, "2,0,1,2": 1,
        "2,0,2,0": 2, "2,0,2,1": 2, "2,0,2,2": 2,
        "2,1,0,0": 2, "2,1,0,1": 2, "2,1,0,2": 0,
        "2,1,1,0": 2, "2,1,1,1": 2, "2,1,1,2": 1,
        "2,1,2,0": 2, "2,1,2,1": 2, "2,1,2,2": 2,
        "2,2,0,0": 2, "2,2,0,1": 2, "2,2,0,2": 2,
        "2,2,1,0": 2, "2,2,1,1": 2, "2,2,1,2": 2,
        "2,2,2,0": 2, "2,2,2,1": 2, "2,2,2,2": 2,
    };

    let alphaDitolak = 0, alphaDipertimbangkan = 0, alphaDisetujui = 0;
    let ruleDetail = [];
    let ruleNo = 1;

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

                    if (output === 0) alphaDitolak         = Math.max(alphaDitolak,         alpha);
                    if (output === 1) alphaDipertimbangkan = Math.max(alphaDipertimbangkan, alpha);
                    if (output === 2) alphaDisetujui       = Math.max(alphaDisetujui,       alpha);

                    ruleDetail.push({
                        no: ruleNo++,
                        penghasilan: namaPenghasilan[iP],
                        lamaKerja:   namaLamaKerja[iL],
                        riwayat:     namaRiwayat[iR],
                        hutang:      namaHutang[iH],
                        output:      namaOutput[output],
                        alpha:       alpha
                    });
                }
            }
        }
    }

    // =========================
    // KOMPOSISI MAX
    // =========================

    let ditolak         = alphaDitolak;
    let dipertimbangkan = alphaDipertimbangkan;
    let disetujui       = alphaDisetujui;

    // =========================
    // DEFUZZIFIKASI (Centroid)
    // =========================

    let pembilang = 0, penyebut = 0;

    for (let z = 0; z <= 100; z += 0.1) {

        let muDitolak = 0;
        if (z <= 40) muDitolak = 1;
        else if (z > 40 && z <= 50) muDitolak = (50 - z) / (50 - 40);

        let muDipertimbangkan = 0;
        if (z > 40 && z <= 60)  muDipertimbangkan = (z - 40) / (60 - 40);
        else if (z > 60 && z <= 80) muDipertimbangkan = (80 - z) / (80 - 60);

        let muDisetujui = 0;
        if (z > 70 && z <= 80) muDisetujui = (z - 70) / (80 - 70);
        else if (z >= 80)      muDisetujui = 1;

        let alpha = Math.max(
            Math.min(ditolak,         muDitolak),
            Math.min(dipertimbangkan, muDipertimbangkan),
            Math.min(disetujui,       muDisetujui)
        );

        pembilang += z * alpha;
        penyebut  += alpha;
    }

    let hasilCrisp = pembilang / penyebut;

    // =========================
    // KEPUTUSAN
    // =========================

    let keputusan, warnaKeputusan;
    if (hasilCrisp >= 70) {
        keputusan      = "KREDIT DISETUJUI";
        warnaKeputusan = "disetujui";
    } else if (hasilCrisp >= 50) {
        keputusan      = "KREDIT DIPERTIMBANGKAN";
        warnaKeputusan = "dipertimbangkan";
    } else {
        keputusan      = "KREDIT DITOLAK";
        warnaKeputusan = "ditolak";
    }

    const ruleAktif = ruleDetail.filter(r => r.alpha > 0);

    const badgeClass = (out) => {
        if (out === 'Disetujui')       return 'badge-disetujui';
        if (out === 'Dipertimbangkan') return 'badge-dipertimbangkan';
        return 'badge-ditolak';
    };

    // =========================
    // OUTPUT
    // =========================

    document.getElementById("hasil").innerHTML = `

    <div class="card hasil-akhir">
        <div class="status-keputusan ${warnaKeputusan}">${keputusan}</div>
        <h3>Hasil Akhir</h3>
        <p>Nilai Crisp : <strong>${hasilCrisp.toFixed(2)}</strong></p>
    </div>

    <div class="card">
        <h3>Fuzzifikasi Penghasilan</h3>
        <p>Rendah : ${penghasilanRendah.toFixed(4)}</p>
        <p>Sedang : ${penghasilanSedang.toFixed(4)}</p>
        <p>Tinggi : ${penghasilanTinggi.toFixed(4)}</p>
    </div>

    <div class="card">
        <h3>Fuzzifikasi Lama Bekerja</h3>
        <p>Baru  : ${kerjaBaru.toFixed(4)}</p>
        <p>Cukup : ${kerjaCukup.toFixed(4)}</p>
        <p>Lama  : ${kerjaLama.toFixed(4)}</p>
    </div>

    <div class="card">
        <h3>Fuzzifikasi Riwayat Kredit</h3>
        <p>Buruk  : ${kreditBuruk.toFixed(4)}</p>
        <p>Sedang : ${kreditSedang.toFixed(4)}</p>
        <p>Baik   : ${kreditBaik.toFixed(4)}</p>
    </div>

    <div class="card">
        <h3>Fuzzifikasi Rasio Hutang</h3>
        <p>Rendah : ${hutangRendah.toFixed(4)}</p>
        <p>Sedang : ${hutangSedang.toFixed(4)}</p>
        <p>Tinggi : ${hutangTinggi.toFixed(4)}</p>
    </div>

    <div class="card">
        <h3>Komposisi MAX</h3>
        <p>Ditolak         : ${ditolak.toFixed(4)}</p>
        <p>Dipertimbangkan : ${dipertimbangkan.toFixed(4)}</p>
        <p>Disetujui       : ${disetujui.toFixed(4)}</p>
    </div>

    <div class="card">
        <h3>Defuzzifikasi (Centroid)</h3>
        <p>Pembilang   : ${pembilang.toFixed(4)}</p>
        <p>Penyebut    : ${penyebut.toFixed(4)}</p>
        <p>Nilai Crisp : <strong>${hasilCrisp.toFixed(4)}</strong></p>
    </div>

    <div class="card" style="grid-column: 1 / -1;">
        <h3>Rule Aktif dari 81 Rule Base</h3>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Penghasilan</th>
                    <th>Lama Bekerja</th>
                    <th>Riwayat Kredit</th>
                    <th>Rasio Hutang</th>
                    <th>Output</th>
                    <th>Alpha (α)</th>
                </tr>
            </thead>
            <tbody>
                ${ruleAktif.map(r => `
                <tr>
                    <td>R${r.no}</td>
                    <td>${r.penghasilan}</td>
                    <td>${r.lamaKerja}</td>
                    <td>${r.riwayat}</td>
                    <td>${r.hutang}</td>
                    <td><span class="${badgeClass(r.output)}">${r.output}</span></td>
                    <td>${r.alpha.toFixed(4)}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        <p class="rule-info">Menampilkan ${ruleAktif.length} rule aktif (α > 0) dari total 81 rule.</p>
    </div>

    `;
}
