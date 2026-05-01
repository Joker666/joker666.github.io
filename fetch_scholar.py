import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://scholar.google.com/citations?user=fFq6TTAAAAAJ&hl=en"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    links = re.findall(r'href="(/citations\?view_op=view_citation&amp;hl=en&amp;user=fFq6TTAAAAAJ&amp;citation_for_view=[^"]+)"', html)
    print(f"Found {len(links)} links")
    for link in links:
        link = link.replace("&amp;", "&")
        article_url = "https://scholar.google.com" + link
        print("URL:", article_url)
        areq = urllib.request.Request(article_url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
        ahtml = urllib.request.urlopen(areq, context=ctx).read().decode('utf-8')
        
        # title
        title_match = re.search(r'<a class="gsc_oci_title_link"[^>]*>(.*?)</a>', ahtml)
        title = title_match.group(1) if title_match else "Unknown"
        
        # abstract
        abstract_match = re.search(r'<div class="gsh_csp">(.*?)</div>', ahtml, re.DOTALL | re.IGNORECASE)
        if not abstract_match:
             abstract_match = re.search(r'<div class="gsc_oci_value" id="gsc_oci_descr">(.*?)</div>', ahtml, re.DOTALL | re.IGNORECASE)
        abstract = abstract_match.group(1) if abstract_match else "No abstract"
        
        print("Title:", title)
        print("Abstract:", abstract.strip())
        print("---")
except Exception as e:
    print("Error:", e)
