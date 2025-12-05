<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>EcoCost Report — S{{ $data['meta']['semester'] }} {{ $data['meta']['year'] }}</title>

    <style>
        /* ================================================================
           PAGE SETUP
        ================================================================ */
        @page {
            margin: 110px 45px 70px 45px;
        }
        @page:first { margin: 0 !important; }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #222;
            font-size: 12px;
            counter-reset: page 0;
        }

        /* ================================================================
           HEADER (Hidden on Cover)
        ================================================================ */
        header {
            position: fixed;
            top: -80px;
            left: 0;
            right: 0;
            height: 70px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            border-bottom: 1px solid #ccc;
            padding-bottom: 8px;
            visibility: hidden;
        }
        body:not(:first-child) header { visibility: visible !important; }

        header img { height: 50px; }

        .header-meta {
            text-align: right;
        }
        .header-meta-title {
            font-weight: bold;
            font-size: 14px;
        }
        .header-meta-user {
            font-size: 10px;
            margin-top: 2px;
            color: #666;
        }

        /* ================================================================
           FOOTER
        ================================================================ */
        footer {
            position: fixed;
            bottom: -50px;
            left: 0;
            right: 0;
            height: 40px;

            border-top: 1px solid #ccc;

            display: flex;
            justify-content: space-between;
            align-items: center;

            font-size: 11px;
            color: #555;
            visibility: hidden;
        }
        body:not(:first-child) footer { visibility: visible !important; }
        .page-number:after { content: counter(page); }

        /* ================================================================
           COVER PAGE
        ================================================================ */
        .cover {
            text-align: center;
            padding-top: 160px;
            page-break-after: always;
        }
        .cover-logo {
            width: 220px;
            margin-bottom: 30px;
        }
        .cover-title {
            font-size: 34px;
            font-weight: bold;
            color: #1a4d1a;
            margin-bottom: 10px;
        }
        .cover-sub {
            font-size: 20px;
            margin-bottom: 25px;
        }
        .cover-meta {
            font-size: 14px;
            color: #555;
            line-height: 1.6;
        }

        .user-block {
            margin-top: 30px;
            font-size: 13px;
            color: #444;
        }
        .user-block strong {
            color: #222;
        }

        /* ================================================================
           SECTION TITLE
        ================================================================ */
        .section-title {
            font-size: 16px;
            font-weight: bold;
            padding-bottom: 4px;
            border-bottom: 2px solid #2f7d32;
            margin: 25px 0 10px 0;
            color: #2f7d32;
        }

        /* ================================================================
           TABLES
        ================================================================ */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        th {
            background: #2f7d32;
            color: white;
            padding: 8px 10px;
            font-size: 11px;
            border: none;
            text-align: left;
        }
        td {
            padding: 7px 10px;
            font-size: 11px;
        }
        tr:nth-child(even) td { background: #f5faf4; }
        .amount {
            font-weight: bold;
            color: #1f5e20;
            text-align: right;
        }

        .expenses-table td { font-size: 10px; }
    </style>
</head>

<body>

<!-- ============================================================
     COVER PAGE
============================================================ -->
<div class="cover">
    <img src="{{ public_path('images/ecocost_logo.png') }}" class="cover-logo">

    <div class="cover-title">EcoCost Semester Report</div>
    <div class="cover-sub">Semester {{ $data['meta']['semester'] }} • {{ $data['meta']['year'] }}</div>

    <div class="cover-meta">
        <strong>Reporting Period:</strong><br>
        {{ $data['meta']['start'] }} – {{ $data['meta']['end'] }}<br><br>

        <strong>Date Generated:</strong><br>
        {{ now()->format('F d, Y') }}<br><br>

        <div class="user-block">
            <strong>Prepared By:</strong><br>
            {{ auth()->user()->name }}<br>
            {{ auth()->user()->email }}<br>
            Organization: Ateneo de Zamboanga University — EntreHub
        </div>
    </div>
</div>

<!-- ============================================================
     HEADER & FOOTER
============================================================ -->
<header>
    <img src="{{ public_path('images/ecocost_logo.png') }}">
    <div class="header-meta">
        <div class="header-meta-title">
            Semester Report — S{{ $data['meta']['semester'] }} {{ $data['meta']['year'] }}
        </div>
        <div class="header-meta-user">
            {{ auth()->user()->name }} • {{ auth()->user()->email }}
        </div>
        <div class="subtle">
            {{ $data['meta']['start'] }} to {{ $data['meta']['end'] }}
        </div>
    </div>
</header>

<footer>
    <div>EcoCost • Sustainability Monitoring System</div>
    <div>Page <span class="page-number"></span></div>
</footer>

<!-- ============================================================
     MAIN CONTENT
============================================================ -->
<main>

    <!-- EXEC SUMMARY -->
    <div class="section-title">Executive Summary</div>
    <table>
        <tr>
            <th style="width:40%">Total Spending</th>
            <td>₱{{ number_format($data['summary']['total_amount'], 2) }}</td>
        </tr>
        <tr>
            <th>Total Entries</th>
            <td>{{ $data['summary']['entries'] }}</td>
        </tr>
        <tr>
            <th>Top Category</th>
            <td>{{ $data['summary']['highest_category'] ?? '—' }}</td>
        </tr>
        <tr>
            <th>Report Prepared By</th>
            <td>{{ auth()->user()->name }} ({{ auth()->user()->email }})</td>
        </tr>
    </table>

    <!-- CATEGORY BREAKDOWN -->
    <div class="section-title">Category Breakdown</div>
    <table>
        <thead>
        <tr><th>Category</th><th>Total Amount</th></tr>
        </thead>
        <tbody>
        @foreach ($data['by_category'] as $c)
            <tr>
                <td>{{ $c['name'] }}</td>
                <td class="amount">₱{{ number_format($c['amount'], 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <!-- MONTHLY BREAKDOWN -->
    <div class="section-title">Monthly Breakdown</div>
    <table>
        <thead>
        <tr><th>Month</th><th>Amount</th></tr>
        </thead>
        <tbody>
        @foreach ($data['monthly'] as $m)
            <tr>
                <td>{{ $m['label'] }}</td>
                <td class="amount">₱{{ number_format($m['amount'], 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <!-- TOP SUBCATEGORIES -->
    <div class="section-title">Top Subcategories</div>
    <table>
        <thead>
        <tr><th>Subcategory</th><th>Total Amount</th></tr>
        </thead>
        <tbody>
        @foreach ($data['top_subcategories'] as $s)
            <tr>
                <td>{{ $s['name'] }}</td>
                <td class="amount">₱{{ number_format($s['amount'], 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <!-- EXPENSE DETAILS -->
    <div class="section-title">Detailed Expense Records</div>

    <table class="expenses-table">
        <thead>
        <tr>
            <th>Date</th>
            <th>Expense Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th style="text-align:right;">Amount</th>
            <th>Remarks</th>
        </tr>
        </thead>

        <tbody>
        @foreach ($data['expenses'] as $e)
            <tr>
                <td>{{ $e['date'] }}</td>
                <td>{{ $e['expense_name'] }}</td>
                <td>{{ $e['category_name'] }}</td>
                <td>{{ $e['subcategory_name'] }}</td>
                <td class="amount">₱{{ number_format($e['amount'], 2) }}</td>
                <td>{{ $e['remarks'] }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

</main>

</body>
</html>
