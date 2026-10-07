import { Bell, Car, FileText, LayoutDashboard, Pencil, Plus, Search, Trash2, Wrench } from 'lucide-react'
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Alert,
  AppShell,
  Avatar,
  Badge,
  BarChart,
  Breadcrumb,
  Button,
  Checkbox,
  Count,
  DescriptionList,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  IconButton,
  Input,
  Meter,
  Money,
  NativeSelect,
  NavGroup,
  NavItem,
  PageHeader,
  PageLayout,
  Pagination,
  Panel,
  PanelHeader,
  PlateChip,
  Radio,
  SearchInput,
  SegmentedControl,
  Section,
  SidebarBrand,
  SidebarNav,
  Skeleton,
  Spinner,
  Stat,
  StatStrip,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  UIProvider,
  toast,
  CommandPalette,
} from '../src'
import './gallery.css'

const labels = { menu: 'Menu', close: 'Close', skip: 'Skip to content', navigation: 'Navigation' }

function Gallery() {
  const [seg, setSeg] = useState<'link' | 'manual'>('link')
  const [sw, setSw] = useState(true)
  const [open, setOpen] = useState(false)
  const [palette, setPalette] = useState(false)
  const bars = Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}/9`,
    value: i === 29 ? 1740000 : i % 7 === 0 ? 600000 + i * 20000 : 0,
  }))
  return (
    <AppShell
      labels={labels}
      sidebar={
        <>
          <SidebarBrand>
            <span className="text-subheading">VietGara</span>
          </SidebarBrand>
          <SidebarNav label="Main">
            <NavGroup label="Operations">
              <NavItem icon={<LayoutDashboard />} label="Dashboard" aria-current="page" href="#" />
              <NavItem icon={<FileText />} label="Quotes" href="#" />
              <NavItem icon={<Wrench />} label="Repair orders" count={3} href="#" />
            </NavGroup>
            <NavGroup label="Customers">
              <NavItem icon={<Car />} label="Vehicles" href="#" />
            </NavGroup>
          </SidebarNav>
        </>
      }
      headerStart={<span className="text-body font-semibold">Gara Minh Tuấn</span>}
      header={
        <>
          <IconButton label="Search" icon={<Search aria-hidden />} onClick={() => setPalette(true)} />
          <IconButton label="Notifications" icon={<Bell aria-hidden />} />
          <ThemeToggle label="Theme" options={{ light: 'Light', dark: 'Dark', system: 'System' }} />
        </>
      }
    >
      <PageLayout>
        <PageHeader
          breadcrumb={
            <Breadcrumb
              label="Breadcrumb"
              items={[{ label: 'Quotes', href: '#' }, { label: 'BG-202610-0007' }]}
              renderLink={(i) => (
                <a href="#" className="hover:text-foreground">
                  {i.label}
                </a>
              )}
            />
          }
          title="Component gallery"
          meta={<Badge tone="info">Sent</Badge>}
          description="Every kit component in the current theme."
          actions={
            <>
              <Button variant="outline">Export PDF</Button>
              <Button variant="primary">
                <Plus /> New quote
              </Button>
            </>
          }
        />
        <StatStrip>
          <Stat label="Monthly revenue" value={<Money text="1.740.000 ₫" />} hint="vs last month +12%" />
          <Stat label="Orders in progress" value="1" />
          <Stat label="Outstanding" value={<Money text="740.000 ₫" />} tone="warning" />
          <Stat label="Loading" value="" loading />
        </StatStrip>
        <Panel>
          <PanelHeader title="Revenue, last 30 days" />
          <div className="p-5">
            <BarChart
              points={bars}
              label="Revenue"
              formatValue={(v) => `${v.toLocaleString('vi-VN')} ₫`}
              formatTick={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}k` : String(v))}
            />
          </div>
        </Panel>
        <Panel>
          <PanelHeader
            title="Customers"
            actions={
              <Button size="sm" variant="primary">
                <Plus /> Add
              </Button>
            }
          />
          <div className="border-b border-border p-4">
            <SearchInput icon={<Search />} placeholder="Search customers…" aria-label="Search" />
          </div>
          <Table caption="Customers">
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Vehicle</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell numeric>Total</TableHeaderCell>
                <TableHeaderCell>
                  <span className="sr-only">Actions</span>
                </TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {[
                ['Trần Thị Bích', '51F-123.45', 'success', 'Paid', '1.250.000 ₫'],
                ['Lê Văn Cường', '59A-678.90', 'warning', 'Pending', '730.000 ₫'],
                ['Phạm Quốc Đạt', '30G-456.78', 'destructive', 'Overdue', '1.740.000 ₫'],
              ].map(([n, p, t, s, m]) => (
                <TableRow key={n} rail={t === 'destructive' ? 'destructive' : undefined}>
                  <TableCell primary label="Name">
                    {n}
                  </TableCell>
                  <TableCell label="Vehicle">
                    <PlateChip>{p}</PlateChip>
                  </TableCell>
                  <TableCell label="Status">
                    <Badge tone={t as 'success'}>{s}</Badge>
                  </TableCell>
                  <TableCell numeric label="Total">
                    <Money text={m} />
                  </TableCell>
                  <TableCell actions>
                    <IconButton label={`Edit ${n}`} icon={<Pencil aria-hidden />} size="icon-sm" />
                    <IconButton label={`Delete ${n}`} icon={<Trash2 aria-hidden />} size="icon-sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={1}
            pageSize={20}
            total={3}
            onPageChange={() => undefined}
            summary="1–3 of 3"
            previousLabel="Previous"
            nextLabel="Next"
          />
        </Panel>
        <Section title="Form controls">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" required hint="As on the ID card.">
              <Input placeholder="Nguyễn Văn A" />
            </Field>
            <Field label="Email" error="Enter a valid e-mail address.">
              <Input defaultValue="abc" />
            </Field>
            <Field label="Status">
              <NativeSelect>
                <option>All</option>
                <option>Draft</option>
              </NativeSelect>
            </Field>
            <Field label="Disabled">
              <Input disabled defaultValue="Locked" />
            </Field>
            <Field label="Address" className="md:col-span-2">
              <Textarea />
            </Field>
            <div className="flex flex-col gap-3">
              <Checkbox label="Customer consents" defaultChecked />
              <Checkbox label="Unchecked" />
              <Radio name="r" label="Radio A" defaultChecked />
              <Radio name="r" label="Radio B" />
              <label className="flex items-center gap-3 text-body">
                <Switch label="Notify" checked={sw} onCheckedChange={setSw} /> Email notifications
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <SegmentedControl
                label="Approval"
                value={seg}
                onValueChange={setSeg}
                options={[
                  { value: 'link', label: 'Send link' },
                  { value: 'manual', label: 'Record manually' },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button>Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="link">Link</Button>
                <Button variant="primary" loading>
                  Saving
                </Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Draft</Badge>
                <Badge tone="info">Sent</Badge>
                <Badge tone="success">Approved</Badge>
                <Badge tone="warning">Waiting</Badge>
                <Badge tone="destructive">Rejected</Badge>
                <Count>12</Count>
                <Count tone="primary">3</Count>
                <Avatar initials="NT" />
                <Avatar initials="AB" size="lg" />
                <Spinner label="Loading" />
              </div>
              <Meter value={4} max={5} label="Staff" />
            </div>
          </div>
        </Section>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">
              Stock <Count>5</Count>
            </TabsTrigger>
            <TabsTrigger value="b">Movements</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <DescriptionList
              items={[
                { label: 'Customer', value: 'Trần Thị Bích' },
                { label: 'Vehicle', value: <PlateChip>51F-123.45</PlateChip> },
                { label: 'Total', value: <Money text="1.250.000 ₫" /> },
              ]}
            />
          </TabsContent>
        </Tabs>
        <div className="grid gap-4 md:grid-cols-2">
          <Alert
            tone="info"
            title="14 days left in your trial"
            action={
              <Button size="sm" variant="primary">
                Choose plan
              </Button>
            }
          >
            Choose a plan to keep using VietGara.
          </Alert>
          <Alert tone="warning" title="2 items low on stock" />
          <Alert tone="destructive" title="Couldn't load customers">
            Check your connection and retry.
          </Alert>
          <Alert tone="success" title="Quote saved" />
        </div>
        <Panel>
          <EmptyState
            title="No quotes yet"
            message="Create your first quote to get started."
            action={
              <Button variant="primary">
                <Plus /> New quote
              </Button>
            }
          />
        </Panel>
        <Panel>
          <EmptyState kind="search" message="No results for “xyz”." action={<Button variant="outline">Clear filters</Button>} compact />
        </Panel>
        <Panel>
          <EmptyState
            kind="error"
            title="Something went wrong"
            message="We couldn't load this page."
            action={<Button variant="outline">Retry</Button>}
            compact
          />
        </Panel>
        <Panel className="p-5">
          <div className="space-y-3" aria-busy="true">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </Panel>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Button onClick={() => toast.success('Quote saved')}>Success toast</Button>
          <Button onClick={() => toast.error('Could not save')}>Error toast</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem destructive>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent closeLabel="Close">
            <DialogHeader title="Add customer" description="They can be linked to vehicles later." />
            <DialogBody className="flex flex-col gap-4">
              <Field label="Full name" required>
                <Input />
              </Field>
              <Field label="Phone">
                <Input />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CommandPalette
          open={palette}
          onOpenChange={setPalette}
          title="Search"
          placeholder="Search…"
          empty="No results"
          groups={[{ heading: 'Pages', items: [{ id: 'q', label: 'Quotes', onSelect: () => undefined, icon: <FileText /> }] }]}
        />
      </PageLayout>
    </AppShell>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider closeLabel="Close">
      <Gallery />
    </UIProvider>
  </StrictMode>,
)
