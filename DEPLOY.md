# Apple Blog — 通过 GitHub 部署到 Oracle Linux

跟着每一条命令敲，不要跳步。

---

## 本地电脑 — 推送代码到 GitHub

### 步骤 1：初始化 Git

打开 **PowerShell**（管理员或普通都行），执行：

```powershell
cd D:\claude\blog

# 初始化 Git 仓库
git init

# 把所有文件加入暂存区
git add .

# 首次提交
git commit -m "Initial commit: apple-style blog"
```

### 步骤 2：创建 GitHub 仓库

1. 浏览器打开 https://github.com/new
2. Repository name 填 `apple-blog`
3. 选 **Private**（私人仓库）即可
4. **不要**勾选 "Add a README file"
5. 不要添加 .gitignore 和 License
6. 点击 **Create repository**

创建后会跳转到一个页面，显示类似这样的命令。复制那三行 push 命令执行：

```powershell
git remote add origin https://github.com/你的用户名/apple-blog.git
git branch -M main
git push -u origin main
```

> 如果弹窗让你登录 GitHub，按提示输入用户名和密码即可。推荐用 Personal Access Token 代替密码（Settings → Developer settings → Tokens）。

刷新 GitHub 页面，确认代码已推送上去了。

---

## 服务器 — Oracle Linux 环境搭建

### 步骤 3：SSH 登录服务器

在你的 PowerShell 里：

```powershell
ssh opc@你的服务器公网IP
```

登录成功后切换到 root：

```bash
sudo su -
```

### 步骤 4：安装 Node.js 20

```bash
dnf install -y curl
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# 验证
node -v     # 应显示 v20.x.x
npm -v      # 应显示 10.x.x
```

### 步骤 5：安装 Nginx

```bash
dnf install -y nginx

systemctl enable nginx
systemctl start nginx
```

### 步骤 6：安装 PM2

```bash
npm install -g pm2

# 配置开机自启，执行后会输出一行命令，把那一行原样复制再执行一次
pm2 startup systemd
```

pm2 startup 会输出类似这样的东西，复制它执行：

```bash
# 示例，以实际输出为准：
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### 步骤 7：放行防火墙

```bash
# 服务器防火墙
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 关闭 SELinux（不关的话 Nginx 代理会 502）
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

### 步骤 8：放行 Oracle Cloud 安全列表

这一步最容易忘，忘了网站就访问不了。

1. 打开 Oracle Cloud 网页控制台
2. 进入你的**实例详情页**
3. 点击「**虚拟云网络**」下面的子网链接
4. 点击「**安全列表**」
5. 点击「**添加入站规则**」，添加两条：

   | 源类型 | 源 CIDR | IP 协议 | 目标端口范围 |
   |--------|---------|---------|-------------|
   | CIDR   | 0.0.0.0/0 | TCP  | 80 |
   | CIDR   | 0.0.0.0/0 | TCP  | 443 |

---

## 服务器 — 拉取并部署项目

### 步骤 9：克隆项目

```bash
cd /var/www

# 用 HTTPS 克隆（公开仓库无需登录），复制你刚才 GitHub 仓库的地址
git clone https://github.com/你的用户名/apple-blog.git

cd apple-blog
```

### 步骤 10：创建必要目录

```bash
mkdir -p data public/uploads logs
chmod 755 data public/uploads
```

三个目录的作用：
- `data/` — 存放文章和用户的 JSON 数据文件
- `public/uploads/` — 存放上传的图片
- `logs/` — PM2 日志

### 步骤 11：安装依赖 & 构建

```bash
npm install

# 构建生产版本（1-2 分钟）
npm run build
```

### 步骤 12：生成 JWT 密钥

```bash
# 生成随机密钥，记下来备用
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "你的 JWT 密钥: $JWT_SECRET"

# 更新 ecosystem.config.cjs 中的 JWT_SECRET
sed -i "s/change-this-to-a-random-string-64-chars/$JWT_SECRET/" ecosystem.config.cjs
```

### 步骤 13：启动应用

```bash
pm2 start ecosystem.config.cjs
pm2 save

# 确认运行中（status 应显示 online）
pm2 status

# 本地测试一下
curl http://localhost:3000
```

如果 `curl http://localhost:3000` 返回了 HTML，说明 Next.js 已经跑起来了。

---

## 服务器 — 配置 Nginx 反向代理

### 步骤 14：配置 Nginx

```bash
cp /var/www/apple-blog/nginx-blog.conf /etc/nginx/conf.d/apple-blog.conf
```

编辑配置文件，把 `your-domain.com` 替换为你的服务器 IP：

```bash
vi /etc/nginx/conf.d/apple-blog.conf
```

假设你的服务器 IP 是 `123.45.67.89`，就把：

```nginx
server_name your-domain.com;
```

改成：

```nginx
server_name 123.45.67.89;
```

`vi` 操作：按 `i` 进入编辑模式 → 改完后按 `Esc` → 输入 `:wq` 回车保存退出。

### 步骤 15：重载 Nginx

```bash
# 检查配置有没有语法错误
nginx -t

# 没问题就重载
systemctl reload nginx
```

---

## 验证部署

打开浏览器访问：**`http://你的服务器IP`**

| 看到什么 | 说明 |
|----------|------|
| 博客首页，大标题 "Thoughts & Stories" | 成功 |
| Nginx 默认页 | Nginx 配置没生效 |
| 无法访问 / 超时 | 防火墙没放行 |
| 502 Bad Gateway | SELinux 没关，或 PM2 没启动 |

后台登录地址：**`http://你的服务器IP/admin/login`**
- 用户名：`admin`
- 密码：`admin123`
- **登录后马上修改密码！**

---

## 以后更新代码

```bash
# 1. 本地改完代码后
cd D:\claude\blog
git add .
git commit -m "描述你改了什么"
git push

# 2. SSH 到服务器
ssh opc@你的服务器IP
sudo su -
cd /var/www/apple-blog
git pull                          # 拉取最新代码
npm install                       # 如有新依赖
npm run build                     # 重新构建
pm2 restart apple-blog            # 重启
```

---

## 给博客配个域名 + HTTPS（推荐）

### 域名

去阿里云 / Cloudflare / Namecheap 买一个域名，添加一条 A 记录指向服务器 IP。

然后修改 Nginx 配置中的 `server_name` 为域名，重载：

```bash
vi /etc/nginx/conf.d/apple-blog.conf  # 改 server_name
systemctl reload nginx
```

### HTTPS 证书（Let's Encrypt 免费）

前提：域名已解析到服务器 IP。

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d 你的域名.com -d www.你的域名.com
```

途中填个邮箱，同意条款，证书就装好了，有效期 90 天会自动续期。

---

## 常见问题

**Q: 网站打不开**
```bash
pm2 status          # PM2 进程在吗？
systemctl status nginx   # Nginx 在跑吗？
curl localhost:3000      # Next.js 在 3000 端口正常吗？
```

**Q: 502 Bad Gateway**
```bash
getenforce          # 应该显示 Disabled，如果不是，执行 setenforce 0
```

**Q: 图片上传失败**
```bash
chmod 755 /var/www/apple-blog/public/uploads
```

**Q: 后台登录不了**
```bash
pm2 logs apple-blog --lines 20   # 看日志
```

**Q: 端口不通**
去 Oracle Cloud 网页控制台 → 安全列表，确认入站规则有 80 端口。
