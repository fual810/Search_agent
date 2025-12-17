<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

apply_cors();
handle_options_if_needed();

$questions = [
    [
        'id' => 'grad_year',
        'title' => '卒業年は？',
        'type' => 'single',
        'options' => ['2026卒', '2027卒', '既卒'],
        'required' => true,
    ],
    [
        'id' => 'degree',
        'title' => '学歴区分は？',
        'type' => 'single',
        'options' => ['学部', '修士', '博士'],
        'required' => true,
    ],
    [
        'id' => 'major',
        'title' => '文理は？',
        'type' => 'single',
        'options' => ['文系', '理系', '情報系', 'その他'],
        'required' => true,
    ],
    [
        'id' => 'location',
        'title' => '希望勤務地は？',
        'type' => 'single',
        'options' => ['全国', '関東', '関西', 'その他'],
        'required' => true,
    ],
    [
        'id' => 'industry',
        'title' => '志望業界は？',
        'type' => 'single',
        'options' => ['IT', 'メーカー', 'コンサル', '金融', 'その他'],
        'required' => true,
    ],
    [
        'id' => 'job_type',
        'title' => '志望職種は？',
        'type' => 'single',
        'options' => ['エンジニア', 'データ', '企画', '営業', 'その他'],
        'required' => true,
    ],
    [
        'id' => 'progress',
        'title' => '就活の進捗は？',
        'type' => 'single',
        'options' => ['これから', 'ES中', '面接中', '内定あり'],
        'required' => true,
    ],
    [
        'id' => 'offer_timing',
        'title' => '内定を取りたい時期は？',
        'type' => 'single',
        'options' => ['1ヶ月以内', '3ヶ月以内', '半年以内', '未定'],
        'required' => false,
    ],
    [
        'id' => 'trouble',
        'title' => '困っていることは？',
        'type' => 'single',
        'options' => ['自己分析', 'ES', '面接', '企業探し', 'その他'],
        'required' => false,
    ],
    [
        'id' => 'contact_pref',
        'title' => '連絡手段の希望は？',
        'type' => 'single',
        'options' => ['メール', '電話', 'どちらでも'],
        'required' => true,
    ],
];

json_response(['questions' => $questions]);
