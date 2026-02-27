// =====================================================================
// デモ音声 設定・制御スクリプト
// =====================================================================

// ヘルパー: ID から要素を取得
function $(id) {
  return document.getElementById(id);
}

// ---------------------------------------------------------------------
// デモ設定
// ---------------------------------------------------------------------

// 共通 14 音声 ID
const AUDIO_IDS = [
  "1st_color_seg1", "1st_color_seg18",
  "ARROW_seg5", "ARROW_seg10", "ARROW_seg11", "ARROW_seg13",
  "BC_seg2", "BC_seg19", "BC_seg20",
  "Closetoyou_seg5", "Closetoyou_seg7", "Closetoyou_seg24",
  "ERROR_seg3", "ERROR_seg21"
];

// 5.1 F0 制御: データセットごとに音声 ID リストを管理
const F0_CONFIG = {
  namine_ritsu: {
    audioIds: AUDIO_IDS,
    defaultId: "BC_seg20"
  },
  nus48e_singing: {
    audioIds: [
      "ADIZ_sing_01_seg3", "SAMF_sing_18_seg7",
      "JLEE_sing_08_seg5", "PMAR_sing_11_seg7",
      "JTAN_sing_07_seg1", "NJAT_sing_16_seg4",
      "KENN_sing_17_seg5", "MCUR_sing_12_seg3",
      "MPOL_sing_19_seg5", "VKOW_sing_20_seg7",
      "MPUR_sing_03_seg5", "ZHIY_sing_06_seg7"
    ],
    defaultId: "ADIZ_sing_01_seg3"
  },
  nus48e_speech: {
    audioIds: [
      "ADIZ_read_01_seg3", "SAMF_read_18_seg7",
      "JLEE_read_08_seg5", "PMAR_read_11_seg7",
      "JTAN_read_07_seg1", "NJAT_read_16_seg4",
      "KENN_read_17_seg5", "MCUR_read_12_seg3",
      "MPOL_read_19_seg5", "VKOW_read_20_seg7",
      "MPUR_read_03_seg5", "ZHIY_read_06_seg7"
    ],
    defaultId: "ADIZ_read_01_seg3"
  }
};

// 5.2 データ選別 (波音リツのみ)
const DS_CONFIG = {
  audioIds: AUDIO_IDS,
  defaultId: "BC_seg20"
};

// 5.3 雑音耐性 (波音リツのみ)
const NOISE_CONFIG = {
  audioIds: AUDIO_IDS,
  defaultId: "BC_seg20"
};

// ---------------------------------------------------------------------
// 汎用: ドロップダウンの選択肢を更新
// ---------------------------------------------------------------------
function populateSelect(selectEl, items, defaultValue) {
  selectEl.innerHTML = "";
  if (items.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "（音声なし）";
    selectEl.appendChild(opt);
    return;
  }
  items.forEach(function (id) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = id;
    if (id === defaultValue) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

// =====================================================================
// 5.1 F0 制御デモ
// =====================================================================
function f0_onDatasetChange() {
  const dataset = $("f0DatasetSelect").value;
  const cfg = F0_CONFIG[dataset];
  populateSelect($("audioIdSelect"), cfg.audioIds, cfg.defaultId);
  f0_updateAudio();
}

function f0_updateAudio() {
  const dataset = $("f0DatasetSelect").value;
  const audioId = $("audioIdSelect").value;
  if (!audioId) return;
  const base = `./wav/f0_control/${dataset}/${audioId}/${audioId}`;

  // デスクトップ用テーブル
  $("natural_f1.0").src     = `${base}_f1.00_Natural.wav`;
  $("sifigan_f1.0").src     = `${base}_f1.00_SiFiGAN.wav`;
  $("sifigan_f0.5").src     = `${base}_f0.50_SiFiGAN.wav`;
  $("sifigan_f2.0").src     = `${base}_f2.00_SiFiGAN.wav`;
  $("vae_sifigan_f1.0").src = `${base}_f1.00_VAE-SiFiGAN.wav`;
  $("vae_sifigan_f0.5").src = `${base}_f0.50_VAE-SiFiGAN.wav`;
  $("vae_sifigan_f2.0").src = `${base}_f2.00_VAE-SiFiGAN.wav`;
  $("woprior_f1.0").src     = `${base}_f1.00_wo_prior.wav`;
  $("woprior_f0.5").src     = `${base}_f0.50_wo_prior.wav`;
  $("woprior_f2.0").src     = `${base}_f2.00_wo_prior.wav`;

  // モバイル用カード
  $("m_natural_f1.0").src     = `${base}_f1.00_Natural.wav`;
  $("m_sifigan_f1.0").src     = `${base}_f1.00_SiFiGAN.wav`;
  $("m_sifigan_f0.5").src     = `${base}_f0.50_SiFiGAN.wav`;
  $("m_sifigan_f2.0").src     = `${base}_f2.00_SiFiGAN.wav`;
  $("m_vae_sifigan_f1.0").src = `${base}_f1.00_VAE-SiFiGAN.wav`;
  $("m_vae_sifigan_f0.5").src = `${base}_f0.50_VAE-SiFiGAN.wav`;
  $("m_vae_sifigan_f2.0").src = `${base}_f2.00_VAE-SiFiGAN.wav`;
  $("m_woprior_f1.0").src     = `${base}_f1.00_wo_prior.wav`;
  $("m_woprior_f0.5").src     = `${base}_f0.50_wo_prior.wav`;
  $("m_woprior_f2.0").src     = `${base}_f2.00_wo_prior.wav`;
}

// =====================================================================
// 5.2 データ選別前後の比較 (波音リツのみ)
// =====================================================================
function ds_init() {
  populateSelect($("dsAudioIdSelect"), DS_CONFIG.audioIds, DS_CONFIG.defaultId);
  ds_updateAudio();
}

function ds_updateAudio() {
  const audioId = $("dsAudioIdSelect").value;
  const ratio   = $("dsF0Select").value;
  if (!audioId) return;
  const base = `./wav/data_selection/namine_ritsu/${audioId}/${audioId}`;

  // Natural は F0 倍率に依存しない
  $("ds_natural").src        = `${base}_Natural.wav`;
  // デスクトップ用テーブル
  $("ds_sifigan_before").src = `${base}_f${ratio}_SiFiGAN_before.wav`;
  $("ds_sifigan_after").src  = `${base}_f${ratio}_SiFiGAN_after.wav`;
  $("ds_vae_before").src     = `${base}_f${ratio}_VAE-SiFiGAN_before.wav`;
  $("ds_vae_after").src      = `${base}_f${ratio}_VAE-SiFiGAN_after.wav`;
  $("ds_woprior_before").src = `${base}_f${ratio}_wo_prior_before.wav`;
  $("ds_woprior_after").src  = `${base}_f${ratio}_wo_prior_after.wav`;

  // モバイル用カード
  $("m_ds_natural").src        = `${base}_Natural.wav`;
  $("m_ds_sifigan_before").src = `${base}_f${ratio}_SiFiGAN_before.wav`;
  $("m_ds_sifigan_after").src  = `${base}_f${ratio}_SiFiGAN_after.wav`;
  $("m_ds_vae_before").src     = `${base}_f${ratio}_VAE-SiFiGAN_before.wav`;
  $("m_ds_vae_after").src      = `${base}_f${ratio}_VAE-SiFiGAN_after.wav`;
  $("m_ds_woprior_before").src = `${base}_f${ratio}_wo_prior_before.wav`;
  $("m_ds_woprior_after").src  = `${base}_f${ratio}_wo_prior_after.wav`;
}

// =====================================================================
// 5.3 雑音耐性デモ (波音リツのみ)
// =====================================================================
function noise_init() {
  populateSelect($("noiseAudioIdSelect"), NOISE_CONFIG.audioIds, NOISE_CONFIG.defaultId);
  noise_updateAudio();
}

function noise_updateAudio() {
  const audioId = $("noiseAudioIdSelect").value;
  const snr     = $("noiseSNRSelect").value;
  const domain  = $("noiseDomainSelect").value;
  if (!audioId) return;

  // clean の場合はドメイン不問、それ以外は domain/snr
  var dir;
  if (snr === "clean") {
    dir = `./wav/noise_robustness/namine_ritsu/clean`;
  } else {
    dir = `./wav/noise_robustness/namine_ritsu/${domain}/${snr}`;
  }

  // デスクトップ用テーブル
  $("noise_natural_noisy").src = `${dir}/${audioId}_Natural_noisy.wav`;
  $("noise_sifigan").src       = `${dir}/${audioId}_SiFiGAN.wav`;
  $("noise_vae").src           = `${dir}/${audioId}_VAE-SiFiGAN.wav`;

  // モバイル用カード
  $("m_noise_natural_noisy").src = `${dir}/${audioId}_Natural_noisy.wav`;
  $("m_noise_sifigan").src       = `${dir}/${audioId}_SiFiGAN.wav`;
  $("m_noise_vae").src           = `${dir}/${audioId}_VAE-SiFiGAN.wav`;
}

// =====================================================================
// 会場モード (Web Audio API によるゲインブースト)
// =====================================================================
var venueCtx = null;       // AudioContext
var venueGain = null;      // GainNode
var venueCompressor = null; // DynamicsCompressorNode
var venueActive = false;
var venueSources = new Map(); // audio element → MediaElementSource

// 通常ゲイン: 1.0 (0 dB)、会場ゲイン: 4.0 (+12 dB)
var VENUE_GAIN_NORMAL = 1.0;
var VENUE_GAIN_BOOST  = 4.0;

function venueInit() {
  if (venueCtx) return; // 既に初期化済み
  venueCtx = new (window.AudioContext || window.webkitAudioContext)();

  // ゲインノード
  venueGain = venueCtx.createGain();
  venueGain.gain.value = VENUE_GAIN_NORMAL;

  // コンプレッサー (クリッピング防止)
  venueCompressor = venueCtx.createDynamicsCompressor();
  venueCompressor.threshold.setValueAtTime(-3, venueCtx.currentTime);
  venueCompressor.knee.setValueAtTime(12, venueCtx.currentTime);
  venueCompressor.ratio.setValueAtTime(8, venueCtx.currentTime);
  venueCompressor.attack.setValueAtTime(0.003, venueCtx.currentTime);
  venueCompressor.release.setValueAtTime(0.15, venueCtx.currentTime);

  // チェーン: source → gain → compressor → destination
  venueGain.connect(venueCompressor);
  venueCompressor.connect(venueCtx.destination);

  // 全 audio 要素を接続
  var audios = document.querySelectorAll("audio");
  audios.forEach(function (el) {
    venueConnectAudio(el);
  });
}

function venueConnectAudio(audioEl) {
  if (!venueCtx || venueSources.has(audioEl)) return;
  var src = venueCtx.createMediaElementSource(audioEl);
  src.connect(venueGain);
  venueSources.set(audioEl, src);
}

function venueToggle() {
  // AudioContext は最初のユーザージェスチャーで初期化
  venueInit();

  // suspended 状態なら resume
  if (venueCtx.state === "suspended") {
    venueCtx.resume();
  }

  venueActive = !venueActive;
  venueGain.gain.setTargetAtTime(
    venueActive ? VENUE_GAIN_BOOST : VENUE_GAIN_NORMAL,
    venueCtx.currentTime,
    0.05
  );

  // UI 更新
  var btn = $("venueModeBtn");
  if (venueActive) {
    btn.classList.add("active");
    btn.querySelector(".venue-label").textContent = "会場モード ON";
  } else {
    btn.classList.remove("active");
    btn.querySelector(".venue-label").textContent = "会場モード";
  }
}

// =====================================================================
// 初期化
// =====================================================================
window.addEventListener("DOMContentLoaded", function () {
  // --- 5.1 F0 制御 ---
  $("f0DatasetSelect").addEventListener("change", f0_onDatasetChange);
  $("changeBtn").addEventListener("click", f0_updateAudio);
  f0_onDatasetChange();

  // --- 5.2 データ選別 ---
  $("dsChangeBtn").addEventListener("click", ds_updateAudio);
  ds_init();

  // --- 5.3 雑音耐性 ---
  $("noiseChangeBtn").addEventListener("click", noise_updateAudio);
  noise_init();

  // --- 会場モード ---
  $("venueModeBtn").addEventListener("click", venueToggle);
});
