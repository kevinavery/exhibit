#import "WSView.h"
#import <WebKit/WebKit.h>

@implementation WSView

- (id)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview {
  if (!(self = [super initWithFrame:frame isPreview:isPreview])) return nil;
  
  // TODO: Find files from config.
  NSString *path = @"/Users/kevinavery/codes/code-screensaver/exhibit/index.js";
  NSString *fileContents = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
  NSString *encodedString = [fileContents stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  
  NSLog(@"%@ %@", fileContents, encodedString);
  
  NSURL* indexHTMLDocumentURL = [NSURL URLWithString:[[[NSURL fileURLWithPath:[[NSBundle bundleForClass:self.class].resourcePath stringByAppendingString:@"/index.html"] isDirectory:NO] description] stringByAppendingFormat:@"?screensaver=1&contents=%@%@", encodedString, self.isPreview ? @"&is_preview=1" : @""]];

  //NSURL *indexHTMLDocumentURL = [NSURL URLWithString:@"http://animejs.com/documentation/"];
  WebView* webView = [[WebView alloc] initWithFrame:NSMakeRect(0, 0, frame.size.width, frame.size.height)];
  webView.frameLoadDelegate = self;
  webView.drawsBackground = NO; // Avoids a "white flash" just before the index.html file has loaded
  [webView.mainFrame loadRequest:[NSURLRequest requestWithURL:indexHTMLDocumentURL cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0]];
  [self addSubview:webView];
  
  return self;
}

#pragma mark - ScreenSaverView

- (void)animateOneFrame { [self stopAnimation]; } // We don't need animation callbacks
- (BOOL)hasConfigureSheet { return NO; } // Nothing to configure

#pragma mark - WebFrameLoadDelegate

- (void)webView:(WebView *)sender didFailLoadWithError:(NSError *)error forFrame:(WebFrame *)frame {
  NSLog(@"%@ error=%@", NSStringFromSelector(_cmd), error);
}

@end
