import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
const logoUrl = `${baseUrl}/logo.png`;

const tailwindConfig = {
    theme: {
        extend: {
            colors: {
                bg: '#ffffff',
                'bg-2': '#f4f5f7',
                fg: '#111827',
                'fg-2': '#374151',
                'fg-3': '#6b7280',
            },
            fontSize: {
                11: ['11px', '16px'],
                13: ['13px', '20px'],
                16: ['16px', '26px'],
                28: ['28px', '36px'],
            },
            screens: {
                mobile: { max: '640px' },
            },
        },
    },
};

const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });

const getTopCategories = (categories = {}) =>
    Object.entries(categories)
        .sort(([, a], [, b]) => Number(b || 0) - Number(a || 0))
        .slice(0, 4);

export default function Email({
    userName = "",
    type = "budget-alert",
    data = {},
}) {
    if( type === "monthly-summary"){
        const stats = data?.stats || {};
        const monthName = data?.monthName || "this month";
        const totalIncome = Number(stats.totalIncome || 0);
        const totalExpenses = Number(stats.totalExpenses || 0);
        const netFlow = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? Math.max(0, (netFlow / totalIncome) * 100) : 0;
        const topExpenses = getTopCategories(stats.expensesByCategory);
        const topIncome = getTopCategories(stats.incomeByCategory);
        const insights = Array.isArray(data?.insight)
            ? data.insight
            : [data?.insight || "Keep tracking consistently. The clearest money decisions usually come from a few small patterns repeated over time."];

        return (
            <Tailwind config={tailwindConfig}>
                <Html>
                    <Head />
                    <Body className="bg-bg-2 m-0 text-center font-sans">
                        <Preview>Your {monthName} money report is ready.</Preview>
                        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
                            <Section>
                                <Section className="bg-bg mobile:px-2 px-6 py-4">
                                    <Section className="mb-3 px-6">
                                        <Row>
                                            <Column className="w-1/2 py-[7px] align-middle">
                                                <Img src={logoUrl} alt="App Logo" width={32} className="block" />
                                            </Column>
                                            <Column align="right" className="w-1/2 py-[7px] align-middle">
                                                <Text className="font-13 m-0 text-right font-sans">
                                                    <span className="text-fg-3">Monthly Report</span>
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Section>

                                    <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[56px] text-left">
                                        <Text className="font-13 text-fg-3 m-0 font-sans">
                                            Personal Expense Tracker
                                        </Text>
                                        <Heading as="h1" className="font-28 text-fg mt-2 mb-3 font-sans">
                                            {monthName} money snapshot
                                        </Heading>
                                        <Text className="font-16 text-fg-2 mt-0 mb-8 max-w-[500px] font-sans">
                                            Hi {userName}, here is the clean read on your month: what came in, what went out, and where your spending had the most gravity.
                                        </Text>

                                        <Section>
                                            <Row style={{ marginBottom: '8px' }}>
                                                <Column style={{ width: '50%', paddingRight: '4px' }}>
                                                    <Section style={{ borderRadius: '14px', backgroundColor: '#ecfdf5', padding: '16px' }}>
                                                        <Text style={{ margin: '0 0 6px', color: '#047857', fontSize: '13px', lineHeight: '18px' }}>Income</Text>
                                                        <Text style={{ margin: '0', color: '#064e3b', fontSize: '24px', lineHeight: '32px', fontWeight: 'bold' }}>{formatCurrency(totalIncome)}</Text>
                                                    </Section>
                                                </Column>
                                                <Column style={{ width: '50%', paddingLeft: '4px' }}>
                                                    <Section style={{ borderRadius: '14px', backgroundColor: '#fff7ed', padding: '16px' }}>
                                                        <Text style={{ margin: '0 0 6px', color: '#c2410c', fontSize: '13px', lineHeight: '18px' }}>Expenses</Text>
                                                        <Text style={{ margin: '0', color: '#7c2d12', fontSize: '24px', lineHeight: '32px', fontWeight: 'bold' }}>{formatCurrency(totalExpenses)}</Text>
                                                    </Section>
                                                </Column>
                                            </Row>

                                            <Row>
                                                <Column style={{ width: '50%', paddingRight: '4px' }}>
                                                    <Section style={{ borderRadius: '14px', backgroundColor: netFlow >= 0 ? '#eef2ff' : '#fef2f2', padding: '16px' }}>
                                                        <Text style={{ margin: '0 0 6px', color: netFlow >= 0 ? '#4338ca' : '#b91c1c', fontSize: '13px', lineHeight: '18px' }}>Net flow</Text>
                                                        <Text style={{ margin: '0', color: netFlow >= 0 ? '#312e81' : '#7f1d1d', fontSize: '24px', lineHeight: '32px', fontWeight: 'bold' }}>{formatCurrency(netFlow)}</Text>
                                                    </Section>
                                                </Column>
                                                <Column style={{ width: '50%', paddingLeft: '4px' }}>
                                                    <Section style={{ borderRadius: '14px', backgroundColor: '#f8fafc', padding: '16px' }}>
                                                        <Text style={{ margin: '0 0 6px', color: '#475569', fontSize: '13px', lineHeight: '18px' }}>Savings rate</Text>
                                                        <Text style={{ margin: '0', color: '#0f172a', fontSize: '24px', lineHeight: '32px', fontWeight: 'bold' }}>{savingsRate.toFixed(1)}%</Text>
                                                    </Section>
                                                </Column>
                                            </Row>
                                        </Section>

                                        <Section style={{ marginTop: '24px', borderRadius: '14px', backgroundColor: '#111827', padding: '20px' }}>
                                            <Text style={{ margin: '0 0 8px', color: '#f9fafb', fontSize: '15px', lineHeight: '22px', fontWeight: 'bold' }}>
                                                Smart advice
                                            </Text>
                                            {insights.map((item, index) => (
                                                <Text key={item} style={{ margin: index === 0 ? '0' : '10px 0 0', color: '#d1d5db', fontSize: '14px', lineHeight: '22px' }}>
                                                    {index + 1}. {item}
                                                </Text>
                                            ))}
                                        </Section>

                                        <Section style={{ marginTop: '24px' }}>
                                            <Heading as="h2" className="text-fg m-0 mb-3 font-sans text-[18px] leading-[26px]">
                                                Top spending categories
                                            </Heading>
                                            {topExpenses.length > 0 ? topExpenses.map(([category, amount]) => (
                                                <Row key={category} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <Column style={{ padding: '10px 0', color: '#374151', fontSize: '14px', lineHeight: '20px' }}>{category}</Column>
                                                    <Column align="right" style={{ padding: '10px 0', color: '#111827', fontSize: '14px', lineHeight: '20px', fontWeight: 'bold' }}>{formatCurrency(amount)}</Column>
                                                </Row>
                                            )) : (
                                                <Text className="font-13 text-fg-3 m-0 font-sans">No expenses recorded for {monthName}.</Text>
                                            )}
                                        </Section>

                                        {topIncome.length > 0 && (
                                            <Section style={{ marginTop: '24px' }}>
                                                <Heading as="h2" className="text-fg m-0 mb-3 font-sans text-[18px] leading-[26px]">
                                                    Income sources
                                                </Heading>
                                                {topIncome.map(([category, amount]) => (
                                                    <Row key={category} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <Column style={{ padding: '10px 0', color: '#374151', fontSize: '14px', lineHeight: '20px' }}>{category}</Column>
                                                        <Column align="right" style={{ padding: '10px 0', color: '#111827', fontSize: '14px', lineHeight: '20px', fontWeight: 'bold' }}>{formatCurrency(amount)}</Column>
                                                    </Row>
                                                ))}
                                            </Section>
                                        )}

                                        <Section style={{ marginTop: '24px', borderRadius: '14px', backgroundColor: '#ffffff', padding: '16px' }}>
                                            <Text style={{ margin: '0', color: '#374151', fontSize: '14px', lineHeight: '22px' }}>
                                                You logged {stats.transactionCount || 0} transaction{stats.transactionCount === 1 ? '' : 's'} in {monthName}. Keep the habit going and next month&apos;s picture gets even sharper.
                                            </Text>
                                        </Section>

                                        <Text className="font-13 text-fg-3 mx-auto mt-10 mb-0 max-w-[420px] text-left font-sans">
                                            Best regards,<br />Personal Expense Tracker Team
                                        </Text>
                                    </Section>

                                    <Section className="bg-bg">
                                        <Row>
                                            <Column className="px-6 py-10 text-center">
                                                <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                                                    &copy; {new Date().getFullYear()} Personal Expense Tracker. All rights reserved.
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Section>
                                </Section>
                            </Section>
                        </Container>
                    </Body>
                </Html>
            </Tailwind>
        );
    }

    if(type === "budget-alert"){
        const percentUsedValue = Number(data?.percentUsed || 0);
        const percentUsed = percentUsedValue.toFixed(1);
        const percentRemaining = Math.max(0, 100 - percentUsedValue).toFixed(1);

        return (
            <Tailwind config={tailwindConfig}>
                <Html>
                    <Head />
                    <Body className="bg-bg-2 m-0 text-center font-sans">
                        <Preview>Budget Alert: You&apos;ve used {percentUsed}% of your budget!</Preview>
                        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
                            <Section>
                                <Section className="bg-bg mobile:px-2 px-6 py-4">
                                    <Section className="mb-3 px-6">
                                        <Row>
                                            <Column className="w-1/2 py-[7px] align-middle">
                                                <Img
                                                    src={logoUrl}
                                                    alt="App Logo"
                                                    width={32}
                                                    className="block"
                                                />
                                            </Column>
                                            <Column align="right" className="w-1/2 py-[7px] align-middle">
                                                <Text className="font-13 m-0 text-right font-sans">
                                                    <span className="text-fg-3">Personal Expense Tracker</span>
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Section>

                                    <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center">
                                        <Section className="mb-3">
                                            <Img
                                                src={logoUrl}
                                                alt="Logo"
                                                width={56}
                                                className="mx-auto mb-5 block"
                                            />
                                            <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                                                Hi {userName},
                                            </Heading>
                                        </Section>

                                        <Text className="font-16 text-fg-2 mx-auto mt-0 mb-5 max-w-[460px] text-center font-sans">
                                            Please be advised that you have utilized {percentUsed}% of your monthly budget. We recommend reviewing your recent expenses to ensure you remain within your allocated limits.
                                        </Text>

                                        <Text className="font-16 text-fg-2 mx-auto mt-0 mb-0 max-w-[420px] text-center font-sans">
                                            {percentRemaining}% of your budget remains available for the rest of the month.
                                        </Text>

                                        <Section className="mt-8 text-left">
                                            <Row style={{ marginBottom: '8px' }}>
                                                <Column
                                                    style={{
                                                        minHeight: '112px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#f3f4f6',
                                                        padding: '16px',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            marginBottom: '0',
                                                            fontSize: '24px',
                                                            lineHeight: '32px',
                                                            fontWeight: 'bold',
                                                            letterSpacing: '-0.025em',
                                                            fontVariantNumeric: 'tabular-nums',
                                                            color: '#111827',
                                                        }}
                                                    >
                                                        ₹{data?.budgetAmount || 0}
                                                    </p>
                                                    <div style={{ color: '#374151' }}>
                                                        <p style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}>
                                                            Total Budget
                                                        </p>
                                                        <p
                                                            style={{
                                                                marginBottom: '0',
                                                                marginTop: '4px',
                                                                fontSize: '13px',
                                                                lineHeight: '18px',
                                                                color: '#4b5563',
                                                            }}
                                                        >
                                                            Your allocated monthly budget.
                                                        </p>
                                                    </div>
                                                </Column>
                                            </Row>
                                            <Row style={{ marginBottom: '8px' }}>
                                                <Column
                                                    style={{
                                                        minHeight: '112px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#111827',
                                                        padding: '16px',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            marginBottom: '0',
                                                            fontSize: '24px',
                                                            lineHeight: '32px',
                                                            fontWeight: 'bold',
                                                            letterSpacing: '-0.025em',
                                                            fontVariantNumeric: 'tabular-nums',
                                                            color: '#f9fafb',
                                                        }}
                                                    >
                                                        ₹{data?.totalExpenses || 0}
                                                    </p>
                                                    <div style={{ color: '#d1d5db' }}>
                                                        <p style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}>
                                                            Total Expenses
                                                        </p>
                                                        <p
                                                            style={{
                                                                marginBottom: '0',
                                                                marginTop: '4px',
                                                                fontSize: '13px',
                                                                lineHeight: '18px',
                                                                color: '#9ca3af',
                                                            }}
                                                        >
                                                            Amount you have spent so far this month.
                                                        </p>
                                                    </div>
                                                </Column>
                                            </Row>
                                            <Row>
                                                <Column
                                                    style={{
                                                        minHeight: '112px',
                                                        borderRadius: '16px',
                                                        backgroundColor: '#4338ca',
                                                        padding: '16px',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            marginBottom: '0',
                                                            fontSize: '24px',
                                                            lineHeight: '32px',
                                                            fontWeight: 'bold',
                                                            letterSpacing: '-0.025em',
                                                            fontVariantNumeric: 'tabular-nums',
                                                            color: '#eef2ff',
                                                        }}
                                                    >
                                                        {percentUsed}%
                                                    </p>
                                                    <div style={{ color: '#e0e7ff' }}>
                                                        <p style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}>
                                                            Budget Used
                                                        </p>
                                                        <p
                                                            style={{
                                                                marginBottom: '0',
                                                                marginTop: '4px',
                                                                fontSize: '13px',
                                                                lineHeight: '18px',
                                                                color: '#c7d2fe',
                                                            }}
                                                        >
                                                            Percentage of your budget that has been used.
                                                        </p>
                                                    </div>
                                                </Column>
                                            </Row>
                                        </Section>

                                        <Text className="font-13 text-fg-3 mx-auto mt-12 mb-0 max-w-[420px] text-left font-sans">
                                            Best regards,<br />Personal Expense Tracker Team
                                        </Text>
                                    </Section>

                                    <Section className="bg-bg">
                                        <Row>
                                            <Column className="px-6 py-10 text-center">
                                                <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                                                    &copy; {new Date().getFullYear()} Personal Expense Tracker. All rights reserved.
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Section>
                                </Section>
                            </Section>
                        </Container>
                    </Body>
                </Html>
            </Tailwind>
        );
    }

}
