describe('LogoCanvas', () => {
  const DEFAULT_WIDTH = 1920;
  const DEFAULT_HEIGHT = 1080;
  const ID = 'mockID';

  let mockContext, mockDomElement, testee; 

  beforeEach(() => {
    mockContext = jasmine.createSpyObj('context', ['clearRect', 'beginPath', 'moveTo', 'lineTo', 'stroke']);
    
    mockDomElement = jasmine.createSpyObj('domElement', ['getContext']);
    mockDomElement.width = 0;
    mockDomElement.height = 0;
    mockDomElement.clientWidth = DEFAULT_WIDTH;
    mockDomElement.clientHeight = DEFAULT_HEIGHT;
    mockDomElement.getContext.and.returnValue(mockContext);

    spyOn(window, 'addEventListener').and.callThrough();
    spyOn(document, 'getElementById').and.returnValue(mockDomElement);

    testee = new LogoCanvas(ID);
  });

  describe('construction', () => {
    it('should get the canvas and create 2D context from passed ID', () => {
      expect(document.getElementById).toHaveBeenCalledWith('mockID');
      expect(mockDomElement.getContext).toHaveBeenCalledWith('2d');
    });

    it('should set to client height and width', () => {
      expect(testee.domElement).toBe(mockDomElement);
      expect(testee.context).toBe(mockContext);
    });

    it('should attach a function to the resize event', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
    });
  });

  describe('clear', () => {
    it('should clear the entire canvas space', () => {
      testee.clear();

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    });
  });

  describe('resize', () => {
    it('should set the width and height to the client width and height', () => {
      mockDomElement.width = 2;
      mockDomElement.height = 2;

      testee.resize();

      expect(mockDomElement.width).toBe(DEFAULT_WIDTH);
      expect(mockDomElement.height).toBe(DEFAULT_HEIGHT);
    });
  });
});